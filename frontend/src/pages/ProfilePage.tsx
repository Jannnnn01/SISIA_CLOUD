import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-950">Perfil</h2>
      <div className="mt-4 text-sm text-slate-700">
        <p><strong>Nombre:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Rol:</strong> {user?.role?.name}</p>
      </div>
    </Card>
  );
};
