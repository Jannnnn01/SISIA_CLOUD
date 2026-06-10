import { useEffect, useState } from 'react';
import { controlsApi } from '../api/controls.api';
import { Card } from '../components/ui/Card';

export const ControlsPage = () => {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { controlsApi.list().then((response) => setItems(response.data.data)); }, []);
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-950">Controles</h2>
      <p className="mt-2 text-sm text-slate-600">Módulo base protegido para controles de seguridad.</p>
      <p className="mt-4 text-sm text-slate-500">Registros: {items.length}</p>
    </Card>
  );
};
