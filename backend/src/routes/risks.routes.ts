import { Router } from 'express';
import { risksController } from '../controllers/risks.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const risksRoutes = Router();

risksRoutes.get('/', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), risksController.list);
risksRoutes.post('/', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), risksController.create);
risksRoutes.get('/:id', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), risksController.getById);
risksRoutes.put('/:id', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), risksController.update);
risksRoutes.patch('/:id/status', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), risksController.changeStatus);
