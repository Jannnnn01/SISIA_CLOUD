import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const MainLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="flex">
      <Sidebar />
      <main className="min-h-screen flex-1">
        <Navbar />
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);
