import { useEffect, useState } from 'react';
import { auditApi } from '../api/audit.api';
import { Card } from '../components/ui/Card';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => { auditApi.list().then((response) => setLogs(response.data.data)); }, []);
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-950">Auditoría</h2>
      <div className="mt-4 space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="rounded-md border border-slate-200 p-3 text-sm">
            <p className="font-medium text-slate-900">{log.action} · {log.module}</p>
            <p className="text-slate-600">{log.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
