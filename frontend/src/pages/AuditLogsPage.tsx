import { useEffect, useState } from 'react';
import { auditApi } from '../api/audit.api';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';

interface AuditLogRow {
  id: number;
  action: string;
  module: string;
  recordId: number | null;
  description: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  } | null;
}

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    auditApi.list()
      .then((response) => setLogs(response.data.data))
      .catch((apiError) => setError(apiError?.response?.data?.message || 'No fue posible cargar auditoría.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-950">Auditoría</h2>
      <p className="mt-1 text-sm text-slate-600">Eventos relevantes registrados por el sistema.</p>
      <div className="mt-4">
        <Alert message={error} />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="py-2">Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Módulo</th>
              <th>Registro</th>
              <th>Descripción</th>
              <th>IP</th>
              <th>User agent</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="py-4 text-slate-500" colSpan={8}>Cargando auditoría...</td></tr>}
            {!loading && logs.map((log) => (
              <tr key={log.id} className="border-t border-slate-100 align-top">
                <td className="py-3">{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.user?.email || 'Sistema'}</td>
                <td className="font-medium text-slate-900">{log.action}</td>
                <td>{log.module}</td>
                <td>{log.recordId || 'N/A'}</td>
                <td>{log.description}</td>
                <td>{log.ipAddress || 'N/A'}</td>
                <td className="max-w-xs break-words text-xs text-slate-500">{log.userAgent || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
