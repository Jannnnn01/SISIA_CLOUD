import { useEffect, useState } from 'react';
import { assetsApi } from '../api/assets.api';
import { Card } from '../components/ui/Card';

export const AssetsPage = () => {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { assetsApi.list().then((response) => setItems(response.data.data)); }, []);
  return <BaseList title="Activos de información" items={items} />;
};

const BaseList = ({ title, items }: { title: string; items: any[] }) => (
  <Card>
    <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
    <p className="mt-2 text-sm text-slate-600">Módulo base protegido, listo para ampliar a CRUD completo.</p>
    <p className="mt-4 text-sm text-slate-500">Registros: {items.length}</p>
  </Card>
);
