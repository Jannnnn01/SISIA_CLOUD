import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

interface DashboardData {
  role: string;
  metrics: {
    users?: number;
    incidents: number;
    auditLogs?: number;
  };
}

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get('/dashboard').then((response) => setData(response.data.data));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
        <p className="text-sm text-slate-600">Resumen operativo según el rol de acceso.</p>
      </div>
      <Badge>{user?.role?.name || 'Sin rol'}</Badge>
      <div className="grid gap-4 md:grid-cols-3">
        {data?.metrics.users !== undefined && <Metric title="Usuarios activos" value={data.metrics.users} />}
        <Metric title="Incidentes visibles" value={data?.metrics.incidents ?? 0} />
        {data?.metrics.auditLogs !== undefined && <Metric title="Eventos de auditoría" value={data.metrics.auditLogs} />}
      </div>
    </div>
  );
};

const Metric = ({ title, value }: { title: string; value: number }) => (
  <Card>
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
  </Card>
);
