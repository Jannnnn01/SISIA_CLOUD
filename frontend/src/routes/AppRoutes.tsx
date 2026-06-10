import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { AssetsPage } from '../pages/AssetsPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { ControlsPage } from '../pages/ControlsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { IncidentsPage } from '../pages/IncidentsPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';
import { RisksPage } from '../pages/RisksPage';
import { UsersPage } from '../pages/UsersPage';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleBasedRoute } from './RoleBasedRoute';

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route element={<RoleBasedRoute roles={['Administrador', 'Analista de Seguridad']} />}>
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/risks" element={<RisksPage />} />
          <Route path="/controls" element={<ControlsPage />} />
        </Route>
        <Route element={<RoleBasedRoute roles={['Administrador']} />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/audit" element={<AuditLogsPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
