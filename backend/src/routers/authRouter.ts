import { Router } from 'express';
import { refreshToken, logout } from '#controllers';
import { authMiddleware } from '#middleware';

const authRouter = Router();

// Refresh and Logout Endpoints
authRouter.post('/refresh', refreshToken); // No auth middleware - uses refresh cookie
authRouter.post('/logout', authMiddleware, logout); // Requires access token

export default authRouter;
export { authRouter };
