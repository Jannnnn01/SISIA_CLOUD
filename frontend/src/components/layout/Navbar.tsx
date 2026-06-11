import { LogOut, Menu, UserCircle } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { navItems } from './navItems';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const role = user?.role?.name || '';
  const items = navItems.filter((item) => item.roles.includes(role));

  return (
    <header className="border-b border-slate-200 bg-white px-4">
      <div className="flex min-h-16 items-center justify-between gap-3 py-3">
        <div>
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.role?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex rounded-md border border-slate-200 p-2 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Abrir menú">
            <Menu size={18} />
          </button>
          <Link to="/profile" className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 sm:inline-flex">
            <UserCircle size={18} />
            Perfil
          </Link>
          <Button onClick={logout} className="gap-2 bg-slate-800">
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-1 pb-3 md:hidden">
          {[...items, { to: '/profile', label: 'Perfil', icon: UserCircle, roles: [role] }].map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      )}
    </header>
  );
};
