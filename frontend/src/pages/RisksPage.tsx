import { useEffect, useState } from 'react';
import { risksApi } from '../api/risks.api';
import { Card } from '../components/ui/Card';

export const RisksPage = () => {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { risksApi.list().then((response) => setItems(response.data.data)); }, []);
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-950">Riesgos</h2>
      <p className="mt-2 text-sm text-slate-600">Módulo base protegido para riesgos asociados a activos.</p>
      <p className="mt-4 text-sm text-slate-500">Registros: {items.length}</p>
    </Card>
  );
};
