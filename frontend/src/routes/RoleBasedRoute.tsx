import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const RoleBasedRoute = ({ roles }: { roles: string[] }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-sm text-slate-600">Validando permisos...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role?.name || '')) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
