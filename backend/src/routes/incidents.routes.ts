import { Router } from 'express';
import { incidentsController } from '../controllers/incidents.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const incidentsRoutes = Router();

incidentsRoutes.use(authenticate);
incidentsRoutes.get('/', incidentsController.list);
incidentsRoutes.post('/', incidentsController.create);
incidentsRoutes.get('/:id', incidentsController.getById);
incidentsRoutes.put('/:id', incidentsController.update);
incidentsRoutes.patch('/:id/status', authorizeRoles('Administrador', 'Analista de Seguridad'), incidentsController.changeStatus);
