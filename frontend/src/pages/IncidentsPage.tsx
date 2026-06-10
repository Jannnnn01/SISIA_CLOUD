import { FormEvent, useEffect, useState } from 'react';
import { incidentsApi } from '../api/incidents.api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export const IncidentsPage = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', category: 'Seguridad', priority: 'media' });

  const load = () => incidentsApi.list().then((response) => setIncidents(response.data.data));

  useEffect(() => {
    load();
  }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    await incidentsApi.create(form);
    setForm({ title: '', description: '', category: 'Seguridad', priority: 'media' });
    await load();
  };

  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-xl font-semibold text-slate-950">Crear incidente</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={create}>
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Título" required />
          <Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Categoría" required />
          <Input value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} placeholder="Prioridad" required />
          <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descripción" required />
          <Button type="submit">Guardar incidente</Button>
        </form>
      </Card>
      <Card>
        <h2 className="text-xl font-semibold text-slate-950">Incidentes</h2>
        <div className="mt-4 space-y-3">
          {incidents.map((incident) => (
            <div key={incident.id} className="rounded-md border border-slate-200 p-3">
              <p className="font-medium text-slate-900">{incident.title}</p>
              <p className="text-sm text-slate-600">{incident.category} · {incident.priority} · {incident.status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
