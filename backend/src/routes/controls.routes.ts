import { Router } from 'express';
import { controlsController } from '../controllers/controls.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const controlsRoutes = Router();

controlsRoutes.get('/', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), controlsController.list);
controlsRoutes.post('/', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), controlsController.create);
controlsRoutes.get('/:id', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), controlsController.getById);
controlsRoutes.put('/:id', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), controlsController.update);
controlsRoutes.patch('/:id/status', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), controlsController.changeStatus);
