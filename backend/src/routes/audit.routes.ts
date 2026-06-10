import { Router } from 'express';
import { auditController } from '../controllers/audit.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const auditRoutes = Router();

auditRoutes.get('/', authenticate, authorizeRoles('Administrador'), auditController.list);
