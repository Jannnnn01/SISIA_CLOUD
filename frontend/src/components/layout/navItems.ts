import { ClipboardList, FileWarning, Gauge, LockKeyhole, ShieldCheck, Users } from 'lucide-react';

export const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge, roles: ['Administrador', 'Analista de Seguridad', 'Usuario'] },
  { to: '/incidents', label: 'Incidentes', icon: FileWarning, roles: ['Administrador', 'Analista de Seguridad', 'Usuario'] },
  { to: '/assets', label: 'Activos', icon: ClipboardList, roles: ['Administrador', 'Analista de Seguridad'] },
  { to: '/risks', label: 'Riesgos', icon: ShieldCheck, roles: ['Administrador', 'Analista de Seguridad'] },
  { to: '/controls', label: 'Controles', icon: LockKeyhole, roles: ['Administrador', 'Analista de Seguridad'] },
  { to: '/users', label: 'Usuarios', icon: Users, roles: ['Administrador'] },
  { to: '/audit', label: 'Auditoría', icon: ClipboardList, roles: ['Administrador'] }
];
