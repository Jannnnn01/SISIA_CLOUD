import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

interface DashboardData {
  role: string;
  metrics: {
    users?: number;
    incidents: number;
    pendingIncidents: number;
    inProgressIncidents: number;
    closedIncidents: number;
    assets?: number;
    risks?: number;
    lowRisks?: number;
    mediumRisks?: number;
    highRisks?: number;
    controls?: number;
    pendingControls?: number;
  };
  latestAuditLogs: Array<{
    id: number;
    action: string;
    module: string;
    description: string;
    createdAt: string;
    user?: { email: string } | null;
  }>;
}

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard')
      .then((response) => setData(response.data.data))
      .catch((apiError) => setError(apiError?.response?.data?.message || 'No fue posible cargar el dashboard.'));
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Dashboard</h2>
        <p className="text-sm text-slate-600">Resumen operativo según el rol de acceso.</p>
      </div>
      <Alert message={error} />
      <Badge>{user?.role?.name || 'Sin rol'}</Badge>
      <div className="grid gap-4 md:grid-cols-3">
        {data?.metrics.users !== undefined && <Metric title="Usuarios activos" value={data.metrics.users} />}
        <Metric title={user?.role?.name === 'Usuario' ? 'Mis incidentes' : 'Total de incidentes'} value={data?.metrics.incidents ?? 0} />
        <Metric title="Pendientes" value={data?.metrics.pendingIncidents ?? 0} />
        <Metric title="En proceso" value={data?.metrics.inProgressIncidents ?? 0} />
        <Metric title="Cerrados" value={data?.metrics.closedIncidents ?? 0} />
        {data?.metrics.assets !== undefined && <Metric title="Activos" value={data.metrics.assets} />}
        {data?.metrics.risks !== undefined && <Metric title="Riesgos" value={data.metrics.risks} />}
        {data?.metrics.lowRisks !== undefined && <Metric title="Riesgos bajos" value={data.metrics.lowRisks} />}
        {data?.metrics.mediumRisks !== undefined && <Metric title="Riesgos medios" value={data.metrics.mediumRisks} />}
        {data?.metrics.highRisks !== undefined && <Metric title="Riesgos altos o críticos" value={data.metrics.highRisks} />}
        {data?.metrics.controls !== undefined && <Metric title="Controles activos/implementados" value={data.metrics.controls} />}
        {data?.metrics.pendingControls !== undefined && <Metric title="Controles pendientes" value={data.metrics.pendingControls} />}
      </div>
      {user?.role?.name === 'Administrador' && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-950">Últimos eventos de auditoría</h3>
          <div className="mt-4 space-y-3">
            {(data?.latestAuditLogs || []).map((log) => (
              <div key={log.id} className="rounded-md border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-900">{log.action} · {log.module}</p>
                <p className="text-slate-600">{log.description}</p>
                <p className="mt-1 text-xs text-slate-500">{log.user?.email || 'Sistema'} · {new Date(log.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const Metric = ({ title, value }: { title: string; value: number }) => (
  <Card>
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
  </Card>
);
