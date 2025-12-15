import { User, UserInventory } from '#models';
import type { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyToken } from '#middleware';
import { success, amberLog, loggerError, critical } from '#utils';
import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response } from 'express';

// Points calculation constants (matching frontend QUICK_REFERENCE.md)
const EXP_WEIGHTS = {
  TOPIC: 100,
  SUBTOPIC: 30,
} as const;

const STREAK_CONFIG = {
  ADDITIVE_THRESHOLD: 3,
  ADDITIVE_BONUS_PER_DAY: 100,
  MULTIPLICATIVE_BASE: 1.5,
  MULTIPLICATIVE_INCREMENT: 0.1,
  MULTIPLICATIVE_MAX: 3,
} as const;

/**
 * Calculate EXP from learned topics
 * EXP = (topics × 100) + (subtopics × 30)
 */
function calculateExp(learnedTopics: Array<{ type: string }>): number {
  // Prefer to use per-item `score` if provided (allows boosted EXP to be stored per learned topic)
  if (
    learnedTopics.some((t: any) => typeof (t as any).score === 'number' && (t as any).score > 0)
  ) {
    return learnedTopics.reduce(
      (acc: number, t: any) => acc + (typeof t.score === 'number' && t.score > 0 ? t.score : 0),
      0
    );
  }
  const topicsCount = learnedTopics.filter((item) => item.type === 'topic').length;
  const subtopicsCount = learnedTopics.filter((item) => item.type === 'subtopic').length;
  return topicsCount * EXP_WEIGHTS.TOPIC + subtopicsCount * EXP_WEIGHTS.SUBTOPIC;
}

/**
 * Calculate the streak multiplier for point awards
 * Days 1-2: Additive bonus (+100 per day on base)
 * Days 3+: Multiplicative bonus (1.5x at day 3, +0.1x per additional day, max 3x)
 */
function getStreakMultiplier(currentStreak: number): number {
  if (currentStreak >= STREAK_CONFIG.ADDITIVE_THRESHOLD) {
    return Math.min(
      STREAK_CONFIG.MULTIPLICATIVE_BASE +
        (currentStreak - STREAK_CONFIG.ADDITIVE_THRESHOLD) * STREAK_CONFIG.MULTIPLICATIVE_INCREMENT,
      STREAK_CONFIG.MULTIPLICATIVE_MAX
    );
  }
  return 1;
}

/**
 * Calculate points to award for a single learned item (topic or subtopic)
 * Applies current streak multiplier to newly earned EXP only (for streaks 3+)
 * For streaks 1-2, only base EXP is awarded (additive bonus is display-only)
 */
function calculatePointsForItem(type: string, currentStreak: number): number {
  const baseExp = type === 'topic' ? EXP_WEIGHTS.TOPIC : EXP_WEIGHTS.SUBTOPIC;

  if (currentStreak >= STREAK_CONFIG.ADDITIVE_THRESHOLD) {
    // Multiplicative bonus for streaks 3+
    const multiplier = getStreakMultiplier(currentStreak);
    return Math.floor(baseExp * multiplier);
  }

  // For streaks 0-2, just award base EXP (no per-item streak bonus)
  return baseExp;
}

/**
 * Award points incrementally when user learns a new topic/subtopic
 * This ADDS to totalScore instead of replacing it
 */
async function awardPointsForLearning(userId: string, awardedExp: number): Promise<number> {
  // Award points equal to the earned EXP (this includes boosts applied when the topic was saved)
  const result = await User.findByIdAndUpdate(
    userId,
    { $inc: { totalScore: awardedExp } },
    { new: true }
  );

  console.log(
    `[awardPointsForLearning] user=${userId} awardedExp=${awardedExp} newTotal=${result?.totalScore}`
  );

  return awardedExp;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export const login: RequestHandler<unknown, any, LoginRequest> = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    loggerError(`[Login] Missing credentials from IP: ${req.ip}`);
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    amberLog(`[Login] Attempt from IP: ${req.ip} email=${email}`);
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      loggerError(`[LOGIN:FAIL] Failed login attempt for email: ${email} (user not found)`);
      critical(`[LOGIN:FAIL] user=${email} reason=user_not_found ip=${req.ip}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      loggerError(
        `[LOGIN:FAIL] Failed login attempt for email: ${email} (invalid password) from IP: ${req.ip}`
      );
      critical(`[LOGIN:FAIL] user=${email} reason=invalid_password ip=${req.ip}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    success(`[LOGIN:SUCCESS] User ${email} authenticated successfully`);

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    // Store refresh token on user (single-per-user)
    user.refreshToken = refreshToken;
    await user.save();
    // Set refresh token cookie (HttpOnly).
    // For cross-origin (different port/host) requests we need SameSite=None so the browser
    // will accept the cookie when making credentialed requests (fetch with credentials: 'include').
    // In production this cookie should be Secure (sent over HTTPS).
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    amberLog(`[Login] Tokens generated for user: ${email}`);
    res.status(200).json({
      token: accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    loggerError(
      `[Login] Error for email: ${email} - ${err instanceof Error ? err.message : String(err)}`
    );
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const register: RequestHandler<unknown, any, RegisterRequest> = async (req, res) => {
  const { email, password, name } = req.body;

  // Allow disabling public registration via env var (useful for admin-managed deployments)
  if (process.env.ENABLE_SIGNUP === 'false') {
    console.warn('[Register] Attempt to register while signup is disabled');
    return res.status(403).json({ message: 'Registration is disabled' });
  }

  if (!email || !password || !name) {
    return res.status(400).json({
      message: 'Email, password, and name are required',
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      roles: ['user'],
      // Initialize learning fields with defaults
      bookmarks: [],
      learnedTopics: [],
      streaks: { current: 0, best: 0 },
      totalScore: 0,
    });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({
      token: accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMe: RequestHandler = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate points breakdown
    // Fetch inventory for this user
    const invItems = await UserInventory.find({ userId });
    const inventory: Record<string, number> = {};
    invItems.forEach((it: any) => (inventory[it.itemId] = it.count));
    const exp = calculateExp(user.learnedTopics || []);
    const currentStreak = user.streaks?.current || 0;
    let basePoints = exp;
    let streakBonus = 0;
    let multiplier = 1;

    if (currentStreak >= STREAK_CONFIG.ADDITIVE_THRESHOLD) {
      multiplier = Math.min(
        STREAK_CONFIG.MULTIPLICATIVE_BASE +
          (currentStreak - STREAK_CONFIG.ADDITIVE_THRESHOLD) *
            STREAK_CONFIG.MULTIPLICATIVE_INCREMENT,
        STREAK_CONFIG.MULTIPLICATIVE_MAX
      );
      const finalPoints = Math.floor(basePoints * multiplier);
      streakBonus = finalPoints - basePoints;
    } else if (currentStreak > 0) {
      // Daily streak bonus: +100 per day for days 1-2
      streakBonus = currentStreak * STREAK_CONFIG.ADDITIVE_BONUS_PER_DAY;
    }

    res.status(200).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        roles: user.roles,
        onboardingData: user.onboardingData || null,
        totalScore: user.totalScore ?? 0,
        wallet: user.wallet ?? 0,
        pointsBreakdown: {
          exp,
          basePoints,
          streakBonus,
          multiplier,
          currentStreak,
        },
        activeBoosts: (user as any).activeBoosts || [],
      },
      inventory,
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const awardPoints: RequestHandler = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { amount, reason } = req.body as { amount?: number; reason?: string };
    const points = typeof amount === 'number' && amount > 0 ? Math.floor(amount) : 0;

    if (points <= 0) {
      return res.status(400).json({ message: 'amount must be a positive integer' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalScore: points } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(
      `[awardPoints] user=${userId} +${points} reason=${reason || 'unspecified'} newTotal=${user.totalScore}`
    );

    res.status(200).json({
      success: true,
      awarded: points,
      totalScore: user.totalScore ?? 0,
      wallet: user.wallet ?? 0,
    });
  } catch (err) {
    console.error('awardPoints error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOnboardingData: RequestHandler = async (req, res) => {
  const userId = req.userId;
  console.log(`[updateOnboardingData] Request received for user: ${userId}`);

  if (!userId) {
    console.error('[updateOnboardingData] Unauthorized: No userId');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { onboardingData } = req.body;
    console.log(
      `[updateOnboardingData] Payload size: ${JSON.stringify(onboardingData).length} chars`
    );
    console.log(
      `[updateOnboardingData] Incoming fields: native=${onboardingData?.nativeLanguage} preferred=${onboardingData?.preferredLanguage}`
    );

    const user = await User.findByIdAndUpdate(userId, { onboardingData }, { new: true });

    if (!user) {
      console.error(`[updateOnboardingData] User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`[updateOnboardingData] Successfully updated user: ${userId}`);
    console.log(
      `[updateOnboardingData] Stored fields: native=${user.onboardingData?.nativeLanguage} preferred=${user.onboardingData?.preferredLanguage}`
    );
    res.status(200).json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        onboardingData: user.onboardingData || null,
      },
    });
  } catch (err) {
    console.error('Update onboarding error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/auth/refresh
export const refreshToken: RequestHandler = async (req: Request, res: Response) => {
  try {
    const cookieToken = req.cookies?.refreshToken;
    if (!cookieToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }
    // verify token signature
    const verified = verifyToken(cookieToken) as JwtPayload | null;
    if (!verified || !verified.userId) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
    const userId = String(verified.userId);
    const user = await User.findById(userId).select('+refreshToken');
    if (!user || !user.refreshToken || user.refreshToken !== cookieToken) {
      return res.status(401).json({ success: false, message: 'Refresh token revoked or invalid' });
    }

    // Rotate refresh token
    const newRefreshToken = generateRefreshToken(userId);
    user.refreshToken = newRefreshToken;
    await user.save();
    // Set cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const newAccessToken = generateAccessToken(userId);
    res.json({ success: true, token: newAccessToken });
  } catch (err) {
    console.error('[Auth] Refresh token error:', err instanceof Error ? err.message : err);
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// POST /api/auth/logout
export const logout: RequestHandler = async (req: Request, res: Response) => {
  try {
    const cookieToken = req.cookies?.refreshToken;
    if (cookieToken) {
      // Try to find user with this refresh token
      const maybeUser = await User.findOne({ refreshToken: cookieToken });
      if (maybeUser) {
        maybeUser.refreshToken = undefined as any;
        await maybeUser.save();
      }
    }
    // Clear cookie
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true });
  } catch (err) {
    console.error('[Auth] Logout error:', err instanceof Error ? err.message : err);
    res.status(500).json({ success: false, message: 'Logout failed' });
  }
};

export const getBookmarks: RequestHandler = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const normalizedBookmarks = (user.bookmarks || [])
      .map((b: any, index: number) => {
        if (typeof b === 'string') {
          return {
            id: `${userId}-${index}`,
            title: b,
            type: 'topic',
            addedAt: new Date().toISOString(),
          };
        }
        return {
          id: b.id || `${userId}-${index}`,
          title: b.title || '',
          type: b.type || 'topic',
          addedAt: b.addedAt || new Date().toISOString(),
        };
      })
      .filter((b: any) => b.title && b.title.trim() !== '');

    res.status(200).json({
      bookmarks: normalizedBookmarks,
    });
  } catch (err) {
    console.error('Get bookmarks error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addBookmark: RequestHandler = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { title, type = 'topic' } = req.body;
    console.log('[AddBookmark] Received:', { title, type });
    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const migratedBookmarks = user.bookmarks
      .map((b: any, index: number) => {
        if (typeof b === 'string') {
          return {
            id: `${userId}-${index}`,
            title: b,
            type: 'topic',
            addedAt: new Date(),
          };
        }
        return {
          id: b.id || `${userId}-${index}`,
          title: b.title || '',
          type: b.type || 'topic',
          addedAt: b.addedAt || new Date(),
        };
      })
      .filter((b: any) => b.title && b.title.trim() !== '');

    user.bookmarks = migratedBookmarks as any;

    const exists = user.bookmarks.some((b: any) => b.title === title);
    if (!exists) {
      const newBookmark = {
        id: Date.now().toString(),
        title,
        type: type || 'topic',
        addedAt: new Date(),
      };
      console.log('[AddBookmark] Adding bookmark:', newBookmark);
      user.bookmarks.push(newBookmark as any);
      console.log('[AddBookmark] Before save, user.bookmarks length:', user.bookmarks.length);
      await user.save();
      console.log('[AddBookmark] Saved successfully');
    }

    const normalizedBookmarks = (user.bookmarks || []).map((b: any, index: number) => {
      if (typeof b === 'string') {
        return {
          id: `${userId}-${index}`,
          title: b,
          type: 'topic',
          addedAt: new Date().toISOString(),
        };
      }
      return {
        id: b.id || `${userId}-${index}`,
        title: b.title || '',
        type: b.type || 'topic',
        addedAt: b.addedAt || new Date().toISOString(),
      };
    });

    res.status(200).json({
      bookmarks: normalizedBookmarks,
      message: 'Bookmark added successfully',
    });
  } catch (err) {
    console.error('Add bookmark error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Error details:', errorMessage);
    res.status(500).json({ message: 'Internal server error', error: errorMessage });
  }
};

export const removeBookmark: RequestHandler = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.bookmarks) {
      user.bookmarks = [];
    }

    const migratedBookmarks = user.bookmarks
      .map((b: any, index: number) => {
        if (typeof b === 'string') {
          return {
            id: `${userId}-${index}`,
            title: b,
            type: 'topic',
            addedAt: new Date(),
          };
        }
        return {
          id: b.id || `${userId}-${index}`,
          title: b.title || '',
          type: b.type || 'topic',
          addedAt: b.addedAt || new Date(),
        };
      })
      .filter((b: any) => b.title && b.title.trim() !== '');
    user.bookmarks = migratedBookmarks as any;

    if (user.bookmarks) {
      user.bookmarks = user.bookmarks.filter((b: any) => b.title !== title);
      await user.save();
    }

    const normalizedBookmarks = (user.bookmarks || []).map((b: any, index: number) => {
      if (typeof b === 'string') {
        return {
          id: `${userId}-${index}`,
          title: b,
          type: 'topic',
          addedAt: new Date().toISOString(),
        };
      }
      return {
        id: b.id || `${userId}-${index}`,
        title: b.title || '',
        type: b.type || 'topic',
        addedAt: b.addedAt || new Date().toISOString(),
      };
    });

    res.status(200).json({
      bookmarks: normalizedBookmarks,
      message: 'Bookmark removed successfully',
    });
  } catch (err) {
    console.error('Remove bookmark error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const markTopicAsLearned: RequestHandler = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { title, type = 'topic', score = 0 } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.learnedTopics) {
      user.learnedTopics = [];
    }

    if (user.bookmarks) {
      const migratedBookmarks = user.bookmarks
        .map((b: any, index: number) => {
          if (typeof b === 'string') {
            return {
              id: `${userId}-${index}`,
              title: b,
              type: 'topic',
              addedAt: new Date(),
            };
          }
          return {
            id: b.id || `${userId}-${index}`,
            title: b.title || '',
            type: b.type || 'topic',
            addedAt: b.addedAt || new Date(),
          };
        })
        .filter((b: any) => b.title && b.title.trim() !== '');
      user.bookmarks = migratedBookmarks as any;
    }

    const alreadyLearned = user.learnedTopics.some((t: any) => t.title === title);
    if (!alreadyLearned) {
      const currentStreak = user.streaks?.current || 0;

      user.learnedTopics.push({
        id: Date.now().toString(),
        title,
        type,
        completedAt: new Date(),
        score,
      });

      if (user.bookmarks) {
        user.bookmarks = user.bookmarks.filter((b: any) => b.title !== title);
      }

      // Determine base EXP for this item and compute final multiplier
      const baseExp = type === 'topic' ? EXP_WEIGHTS.TOPIC : EXP_WEIGHTS.SUBTOPIC;
      // Determine active boost multiplier
      const now = new Date();
      const activeBoosts = (user as any).activeBoosts || [];
      const validBoosts = activeBoosts.filter((b: any) => new Date(b.expiresAt) > now);
      const boostMultiplier = validBoosts.length
        ? Math.max(...validBoosts.map((b: any) => b.multiplier || 1))
        : 1;
      const streakMultiplier =
        currentStreak >= STREAK_CONFIG.ADDITIVE_THRESHOLD ? getStreakMultiplier(currentStreak) : 1;
      const finalMultiplier = boostMultiplier * streakMultiplier;
      const awardedExp = Math.floor(baseExp * finalMultiplier);

      // save the powered score to the learned topic
      (user as any).learnedTopics[user.learnedTopics.length - 1].score = awardedExp;

      await user.save();

      // Award to totalScore the same boosted EXP
      await awardPointsForLearning(userId, awardedExp);
    }

    const normalizedBookmarks = (user.bookmarks || []).map((b: any, index: number) => {
      if (typeof b === 'string') {
        return {
          id: `${userId}-${index}`,
          title: b,
          type: 'topic',
          addedAt: new Date().toISOString(),
        };
      }
      return {
        id: b.id || `${userId}-${index}`,
        title: b.title || '',
        type: b.type || 'topic',
        addedAt: b.addedAt || new Date().toISOString(),
      };
    });

    res.status(200).json({
      learnedTopics: user.learnedTopics,
      bookmarks: normalizedBookmarks,
      message: 'Topic marked as learned',
    });
  } catch (err) {
    console.error('Mark learned error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLearnedTopics: RequestHandler = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      learnedTopics: user.learnedTopics || [],
    });
  } catch (err) {
    console.error('Get learned topics error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
