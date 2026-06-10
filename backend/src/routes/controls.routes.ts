import { Router } from 'express';
import { controlsController } from '../controllers/controls.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const controlsRoutes = Router();

controlsRoutes.get('/', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), controlsController.list);
