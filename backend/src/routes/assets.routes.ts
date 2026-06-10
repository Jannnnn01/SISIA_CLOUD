import { Router } from 'express';
import { assetsController } from '../controllers/assets.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const assetsRoutes = Router();

assetsRoutes.get('/', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), assetsController.list);
