import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserPassword,
  login,
  register,
  getMe,
  awardPoints,
  updateOnboardingData,
  getBookmarks,
  addBookmark,
  removeBookmark,
  markTopicAsLearned,
  getLearnedTopics,
  getStreak,
  recordActivity,
} from '#controllers';
import { validateBodyZod, validateParamsZod, authMiddleware } from '#middleware';
import { adminMiddleware } from '#middleware';
import {
  UserInputSchema,
  UserUpdateInputSchema,
  IdParamSchema,
  ChangeUserPasswordSchema,
  AuthLoginSchema,
  AuthRegisterSchema,
  BookmarkInputSchema,
  LearnedTopicInputSchema,
} from '#schemas';

const userRouter = Router();

// Authentication Endpoints
userRouter.post('/register', validateBodyZod(AuthRegisterSchema), register);
userRouter.post('/login', validateBodyZod(AuthLoginSchema), login);
userRouter.get('/me', authMiddleware, getMe);

// Onboarding Endpoints
userRouter.put('/onboarding', authMiddleware, updateOnboardingData);

// Bookmark Endpoints
userRouter.get('/bookmarks', authMiddleware, getBookmarks);
userRouter.post('/bookmarks', authMiddleware, validateBodyZod(BookmarkInputSchema), addBookmark);
userRouter.delete('/bookmarks', authMiddleware, removeBookmark);

// Learned Topics Endpoints
userRouter.get('/learned-topics', authMiddleware, getLearnedTopics);
userRouter.post(
  '/learned-topics',
  authMiddleware,
  validateBodyZod(LearnedTopicInputSchema),
  markTopicAsLearned
);

// Streak/Activity Endpoints
userRouter.get('/streaks', authMiddleware, getStreak);
userRouter.post('/activity', authMiddleware, recordActivity);
userRouter.post('/award-points', authMiddleware, awardPoints);

// for refactoring
// User Management Endpoints (CRUD)
userRouter.get('/admin/all', authMiddleware, adminMiddleware, getAllUsers);
userRouter.get('/admin/:id', authMiddleware, adminMiddleware, validateParamsZod(IdParamSchema), getUserById);
userRouter.post('/admin/create', authMiddleware, adminMiddleware, validateBodyZod(UserInputSchema), createUser);
userRouter.put(
  '/admin/:id',
  authMiddleware,
  adminMiddleware,
  validateParamsZod(IdParamSchema),
  validateBodyZod(UserUpdateInputSchema),
  updateUser
);
userRouter.patch(
  '/admin/:id/password',
  authMiddleware,
  adminMiddleware,
  validateParamsZod(IdParamSchema),
  validateBodyZod(ChangeUserPasswordSchema),
  changeUserPassword
);
userRouter.delete('/admin/:id', authMiddleware, adminMiddleware, validateParamsZod(IdParamSchema), deleteUser);

export default userRouter;
