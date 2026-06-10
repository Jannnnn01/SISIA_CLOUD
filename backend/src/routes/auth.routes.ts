import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);
authRoutes.get('/me', authenticate, authController.me);
