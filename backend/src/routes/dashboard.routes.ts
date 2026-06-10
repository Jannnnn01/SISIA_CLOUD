import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', authenticate, dashboardController.show);
