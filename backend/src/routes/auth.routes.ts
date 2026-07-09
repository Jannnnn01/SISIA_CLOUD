import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const authRoutes = Router();

const loginLimiter = rateLimit({
  windowMs: env.loginRateLimitWindowMinutes * 60 * 1000,
  max: env.loginRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos de inicio de sesión. Intente más tarde.' }
});

const registerLimiter = rateLimit({
  windowMs: env.registerRateLimitWindowMinutes * 60 * 1000,
  max: env.registerRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos de registro. Intente más tarde.' }
});

authRoutes.post('/login', loginLimiter, authController.login);
authRoutes.post('/register', registerLimiter, authController.register);
authRoutes.get('/me', authenticate, authController.me);
authRoutes.put('/profile', authenticate, authController.updateProfile);
authRoutes.patch('/password', authenticate, authController.changePassword);
authRoutes.post('/logout', authenticate, authController.logout);
