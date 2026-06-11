import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { navItems } from './navItems';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role?.name || '';
  const items = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-white p-4 md:block">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-slate-950">SISIA Cloud</h1>
        <p className="text-xs text-slate-500">Gestión segura académica</p>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
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
    </aside>
  );
};
