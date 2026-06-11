import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';

export const usersRoutes = Router();

usersRoutes.get('/assignees', authenticate, authorizeRoles('Administrador', 'Analista de Seguridad'), usersController.assignees);

usersRoutes.use(authenticate, authorizeRoles('Administrador'));
usersRoutes.get('/', usersController.list);
usersRoutes.post('/', usersController.create);
usersRoutes.get('/:id', usersController.getById);
usersRoutes.put('/:id', usersController.update);
usersRoutes.patch('/:id/status', usersController.changeStatus);
