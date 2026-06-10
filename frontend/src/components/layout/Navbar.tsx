import { LogOut, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
        <p className="text-xs text-slate-500">{user?.role?.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link to="/profile" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
          <UserCircle size={18} />
          Perfil
        </Link>
        <Button onClick={logout} className="gap-2 bg-slate-800">
          <LogOut size={16} />
          Salir
        </Button>
      </div>
    </header>
  );
};
