import { Router } from 'express';
import { risksController } from '../controllers/risks.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const risksRoutes = Router();

risksRoutes.get('/', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), risksController.list);
