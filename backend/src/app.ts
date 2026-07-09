import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
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
import { rolesRoutes } from './routes/roles.routes';
import { usersRoutes } from './routes/users.routes';
import { success } from './utils/response';

export const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origen no permitido por CORS'));
  },
  credentials: true
}));
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
app.use('/api/audit-logs', auditRoutes);
app.use('/api/roles', rolesRoutes);

app.use(errorMiddleware);
