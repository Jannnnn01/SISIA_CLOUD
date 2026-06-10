import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import './models';
import { assetsRoutes } from './routes/assets.routes';
import { auditRoutes } from './routes/audit.routes';
import { authRoutes } from './routes/auth.routes';
import { controlsRoutes } from './routes/controls.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { incidentsRoutes } from './routes/incidents.routes';
import { risksRoutes } from './routes/risks.routes';
import { usersRoutes } from './routes/users.routes';
import { success } from './utils/response';

export const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => success(res, { status: 'ok' }, 'Servicio disponible'));
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/risks', risksRoutes);
app.use('/api/controls', controlsRoutes);
app.use('/api/audit', auditRoutes);

app.use(errorMiddleware);
