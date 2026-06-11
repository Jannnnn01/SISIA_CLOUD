import { Router } from 'express';
import { rolesController } from '../controllers/roles.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const rolesRoutes = Router();

rolesRoutes.get('/', authenticate, authorizeRoles('Administrador'), rolesController.list);
