import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User, Purchase, StoreItem, UserInventory } from '#models';

type BalanceField = 'wallet' | 'totalScore';

const transactionsEnv = process.env.USE_MONGO_TRANSACTIONS;
const transactionsEnabled = transactionsEnv
  ? transactionsEnv.toLowerCase() !== 'false'
  : process.env.NODE_ENV === 'production';

async function runStoreOperation<T>(
  handler: (session: mongoose.ClientSession | null) => Promise<T>
): Promise<T> {
  if (!transactionsEnabled) {
    return handler(null);
  }

  const session = await mongoose.startSession();
  try {
    let opResult: T;
    await session.withTransaction(async () => {
      opResult = await handler(session);
    });
    return opResult!;
  } finally {
    session.endSession();
  }
}

function withSession<T>(query: mongoose.Query<T, any>, session: mongoose.ClientSession | null) {
  return session ? query.session(session) : query;
}

function sessionOptions(session: mongoose.ClientSession | null) {
  return session ? { session } : {};
}

export async function purchaseItem(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { itemId, idempotencyKey } = req.body as { itemId: string; idempotencyKey?: string };
  if (!itemId) return res.status(400).json({ message: 'itemId is required' });

  try {
    const result = await runStoreOperation(async (session) => {
      if (idempotencyKey) {
        const existing = await withSession(Purchase.findOne({ userId, idempotencyKey }), session);
        if (existing) {
          return existing;
        }
      }

      // Prefer treating frontend itemId as SKU (e.g. '6').
      // Fallback to ObjectId lookup only when itemId is a valid ObjectId.
      let item = await withSession(StoreItem.findOne({ sku: itemId }), session);
      if (!item && mongoose.Types.ObjectId.isValid(itemId)) {
        item = await withSession(StoreItem.findById(itemId), session);
      }
      if (!item) throw { status: 400, message: 'Invalid item' };

      const user = await withSession(User.findById(userId), session);
      if (!user) throw { status: 404, message: 'User not found' };

      const price = item.price || 0;
      const walletBalance = Number((user as any).wallet ?? 0);
      const totalScoreBalance = Number((user as any).totalScore ?? 0);

      let balanceField: BalanceField;
      let balance: number;

      if (walletBalance >= price) {
        balanceField = 'wallet';
        balance = walletBalance;
      } else if (totalScoreBalance >= price) {
        balanceField = 'totalScore';
        balance = totalScoreBalance;
      } else {
        const configuredField: BalanceField =
          (user as any).wallet != null ? 'wallet' : 'totalScore';
        const available = Math.max(walletBalance, totalScoreBalance);
        balanceField = configuredField;
        balance = (user as any)[balanceField] ?? 0;
        throw { status: 402, message: 'insufficient_funds', required: price, balance: available };
      }

      // Deduct
      (user as any)[balanceField] = balance - price;

      // Upsert inventory
      const inventoryKey = item.sku || String(item._id) || itemId;
      const inventory = await UserInventory.findOneAndUpdate(
        { userId, itemId: inventoryKey },
        { $inc: { count: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true, ...sessionOptions(session) }
      );

      const purchase = await Purchase.create(
        [
          {
            userId,
            type: 'purchase',
            itemId: item.sku || String(item._id),
            amount: -price,
            balanceAfter: (user as any)[balanceField],
            idempotencyKey: idempotencyKey,
            metadata: { itemName: item.name },
          },
        ],
        session ? { session } : undefined
      );

      await user.save(session ? { session } : undefined);
      // If this purchase is an XP Boost, apply it to the user's activeBoosts.
      const boostSkus: Record<string, { multiplier: number; hours: number }> = {
        '3': { multiplier: 2, hours: 24 },
        '10': { multiplier: 4, hours: 48 },
      };
      let appliedBoost = null;
      const skuKey = item.sku || itemId;
      const def = boostSkus[skuKey as string];
      if (def) {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + def.hours);
        const boost = {
          source: `sku-${item.sku || itemId}`,
          multiplier: def.multiplier,
          expiresAt,
        };
        // Merge with existing boosts for the same source: set expiresAt to max and multiplier to max
        (user as any).activeBoosts = (user as any).activeBoosts || [];
        const existingIndex = (user as any).activeBoosts.findIndex(
          (b: any) => b.source === boost.source
        );
        if (existingIndex >= 0) {
          const existing = (user as any).activeBoosts[existingIndex];
          existing.expiresAt = new Date(
            Math.max(new Date(existing.expiresAt).getTime(), expiresAt.getTime())
          );
          existing.multiplier = Math.max(existing.multiplier || 1, def.multiplier);
          appliedBoost = existing;
        } else {
          (user as any).activeBoosts.push(boost);
          appliedBoost = boost;
        }
        await user.save(session ? { session } : undefined);
      }

      return {
        purchase: purchase[0],
        newBalance: (user as any)[balanceField],
        inventory: { [inventory.itemId]: inventory.count },
        appliedBoost,
      };
    });

    if ((result as any)?.status) {
      const r = result as any;
      return res.status(r.status).json({
        message: r.message,
        ...(r.required ? { required: r.required, balance: r.balance } : {}),
      });
    }

    if (result && (result as any).purchase) {
      const p = (result as any).purchase;
      return res.json({
        success: true,
        transactionId: p._id,
        itemId: p.itemId,
        newBalance: result.newBalance,
        inventory: result.inventory,
        transaction: p,
        appliedBoost: (result as any).appliedBoost || null,
      });
    }

    // idempotent case: existing purchase returned
    if (result && result._id) {
      return res.json({
        success: true,
        transactionId: result._id,
        itemId: result.itemId,
        newBalance: result.balanceAfter,
        transaction: result,
      });
    }

    return res.status(500).json({ message: 'Unknown error' });
  } catch (err: any) {
    console.error('purchaseItem error:', err);
    if (err && err.status)
      return res
        .status(err.status)
        .json({ error: err.message, required: err.required, balance: err.balance });
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getInventory(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const items = await UserInventory.find({ userId });
    const inventory: Record<string, number> = {};
    items.forEach((it: any) => (inventory[it.itemId] = it.count));
    return res.json({ inventory });
  } catch (err) {
    console.error('getInventory error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getPurchases(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Number(req.query.pageSize) || 20);

    const [items, total] = await Promise.all([
      Purchase.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      Purchase.countDocuments({ userId }),
    ]);

    return res.json({ items, page, total });
  } catch (err) {
    console.error('getPurchases error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function consumeShield(req: Request, res: Response) {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { idempotencyKey } = req.body as { idempotencyKey?: string };

  try {
    const result = await runStoreOperation(async (session) => {
      if (idempotencyKey) {
        const existing = await withSession(Purchase.findOne({ userId, idempotencyKey }), session);
        if (existing) {
          return existing;
        }
      }

      // Try to accept frontend item ids as SKUs for shields as well.
      // Accept optional `itemId` in body, otherwise fall back to common shield SKUs including legacy '6'.
      const requestedItemId = (req.body && (req.body.itemId as string)) || undefined;
      const candidateSkus = [requestedItemId, 'shield_basic', 'shield', '6'].filter(
        Boolean
      ) as string[];

      let inventory: any = null;
      for (const sku of candidateSkus) {
        inventory = await withSession(UserInventory.findOne({ userId, itemId: sku }), session);
        if (inventory) break;
      }

      if (!inventory || inventory.count <= 0) throw { status: 400, message: 'no_shield' };

      // Load user and analyze streaks
      const user = await withSession(User.findById(userId), session);
      if (!user) throw { status: 404, message: 'User not found' };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dayBeforeYesterday = new Date(today);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

      const lastActivity = user.streaks?.lastActivityDate
        ? new Date(user.streaks.lastActivityDate)
        : null;
      if (lastActivity) lastActivity.setHours(0, 0, 0, 0);

      // Only allow preserving immediate previous day
      const canPreserve = lastActivity && lastActivity.getTime() === dayBeforeYesterday.getTime();
      if (!canPreserve) throw { status: 400, message: 'cannot_consume_shield' };

      // Decrement inventory
      inventory.count = inventory.count - 1;
      await inventory.save(session ? { session } : undefined);

      // Insert consume purchase
      const consumeDoc = await Purchase.create(
        [
          {
            userId,
            type: 'consume',
            itemId: inventory.itemId,
            amount: 0,
            metadata: { preservedDate: yesterday.toISOString() },
            idempotencyKey,
          },
        ],
        session ? { session } : undefined
      );

      // Update streaks: we add yesterday as activity
      const current = user.streaks?.current || 0;
      user.streaks.current = current + 1;
      if (!user.streaks.best || user.streaks.current > user.streaks.best) {
        user.streaks.best = user.streaks.current;
      }
      user.streaks.lastActivityDate = yesterday;
      await user.save(session ? { session } : undefined);

      return {
        purchase: consumeDoc[0],
        inventory: { [inventory.itemId]: inventory.count },
        newStreakData: {
          currentStreak: user.streaks.current,
          lastActive: user.streaks.lastActivityDate,
        },
      };
    });

    if (result && result.purchase) {
      const p = result.purchase;
      return res.json({
        success: true,
        transactionId: p._id,
        inventory: result.inventory,
        newStreakData: result.newStreakData,
      });
    }

    if (result && result._id) {
      return res.json({
        success: true,
        transactionId: result._id,
        inventory: {},
        newStreakData: {},
      });
    }

    return res.status(500).json({ message: 'Unknown error' });
  } catch (err: any) {
    console.error('consumeShield error:', err);
    if (err && err.status) return res.status(err.status).json({ error: err.message });
    return res.status(500).json({ message: 'Internal server error' });
  }
}
