import { FormEvent, useEffect, useMemo, useState } from 'react';
import { incidentsApi } from '../api/incidents.api';
import { usersApi } from '../api/users.api';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

interface UserSummary {
  id: number;
  name: string;
  email: string;
  role?: { name: string };
}

interface IncidentRow {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'baja' | 'media' | 'alta' | 'critica';
  status: 'pendiente' | 'en_proceso' | 'cerrado' | 'inactivo';
  createdById: number;
  assignedToId: number | null;
  technicalObservation: string | null;
  closedAt: string | null;
  createdBy?: UserSummary;
  assignedTo?: UserSummary | null;
}

const emptyForm = {
  title: '',
  description: '',
  category: 'Seguridad',
  priority: 'media',
  assignedToId: '',
  technicalObservation: ''
};

export const IncidentsPage = () => {
  const { user } = useAuth();
  const canManage = ['Administrador', 'Analista de Seguridad'].includes(user?.role?.name || '');
  const [incidents, setIncidents] = useState<IncidentRow[]>([]);
  const [assignees, setAssignees] = useState<UserSummary[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<IncidentRow | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const filtered = useMemo(() => {
    return incidents.filter((incident) => {
      const statusOk = !statusFilter || incident.status === statusFilter;
      const priorityOk = !priorityFilter || incident.priority === priorityFilter;
      return statusOk && priorityOk;
    });
  }, [incidents, statusFilter, priorityFilter]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const incidentsResponse = await incidentsApi.list();
      setIncidents(incidentsResponse.data.data);
      if (canManage) {
        const assigneesResponse = await usersApi.assignees();
        setAssignees(assigneesResponse.data.data);
      }
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cargar incidentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [canManage]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const edit = (incident: IncidentRow) => {
    setEditingId(incident.id);
    setForm({
      title: incident.title,
      description: incident.description,
      category: incident.category,
      priority: incident.priority,
      assignedToId: incident.assignedToId ? String(incident.assignedToId) : '',
      technicalObservation: incident.technicalObservation || ''
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        ...form,
        assignedToId: form.assignedToId ? Number(form.assignedToId) : null
      };

      if (editingId) {
        await incidentsApi.update(editingId, payload);
        setMessage('Incidente actualizado correctamente.');
      } else {
        await incidentsApi.create(payload);
        setMessage('Incidente creado correctamente.');
      }

      resetForm();
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible guardar el incidente.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (incident: IncidentRow, status: string) => {
    if (status === 'inactivo' && !window.confirm(`¿Inactivar el incidente ${incident.title}?`)) return;
    setError('');
    setMessage('');
    try {
      await incidentsApi.changeStatus(incident.id, status);
      setMessage('Estado actualizado correctamente.');
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cambiar el estado.');
    }
  };

  const assign = async (incident: IncidentRow, assignedToId: string) => {
    setError('');
    setMessage('');
    try {
      await incidentsApi.assign(incident.id, assignedToId ? Number(assignedToId) : null);
      setMessage('Responsable actualizado correctamente.');
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible asignar responsable.');
    }
  };

  const close = async (incident: IncidentRow) => {
    const observation = window.prompt('Observación técnica de cierre', incident.technicalObservation || '');
    if (observation === null) return;
    setError('');
    setMessage('');
    try {
      await incidentsApi.close(incident.id, observation);
      setMessage('Incidente cerrado correctamente.');
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cerrar el incidente.');
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{editingId ? 'Editar incidente' : 'Crear incidente'}</h2>
            <p className="text-sm text-slate-600">Registro y seguimiento de eventos de seguridad.</p>
          </div>
          {editingId && <Button type="button" className="bg-slate-500" onClick={resetForm}>Nuevo incidente</Button>}
        </div>
        <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <Alert message={error} />
          {message && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
          <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Título" required />
          <Input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Categoría" required />
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
            <option value="baja">baja</option>
            <option value="media">media</option>
            <option value="alta">alta</option>
            <option value="critica">critica</option>
          </select>
          <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descripción" required />
          {canManage && (
            <>
              <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.assignedToId} onChange={(event) => setForm({ ...form, assignedToId: event.target.value })}>
                <option value="">Sin responsable</option>
                {assignees.map((assignee) => <option key={assignee.id} value={assignee.id}>{assignee.name}</option>)}
              </select>
              <Input value={form.technicalObservation} onChange={(event) => setForm({ ...form, technicalObservation: event.target.value })} placeholder="Observación técnica" />
            </>
          )}
          <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar incidente' : 'Guardar incidente'}</Button>
        </form>
      </Card>

      <Card>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-xl font-semibold text-slate-950">Incidentes</h2>
          <div className="flex flex-col gap-2 md:flex-row">
            <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">Todos los estados</option>
              <option value="pendiente">pendiente</option>
              <option value="en_proceso">en proceso</option>
              <option value="cerrado">cerrado</option>
              {canManage && <option value="inactivo">inactivo</option>}
            </select>
            <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
              <option value="">Todas las prioridades</option>
              <option value="baja">baja</option>
              <option value="media">media</option>
              <option value="alta">alta</option>
              <option value="critica">critica</option>
            </select>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr><th className="py-2">Título</th><th>Prioridad</th><th>Estado</th><th>Creado por</th><th>Responsable</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td className="py-4 text-slate-500" colSpan={6}>Cargando incidentes...</td></tr>}
              {!loading && filtered.map((incident) => (
                <tr key={incident.id} className="border-t border-slate-100 align-top">
                  <td className="py-3">
                    <p className="font-medium text-slate-900">{incident.title}</p>
                    <p className="text-xs text-slate-500">{incident.category}</p>
                  </td>
                  <td><Badge>{incident.priority}</Badge></td>
                  <td><Badge>{incident.status}</Badge></td>
                  <td>{incident.createdBy?.name || 'N/A'}</td>
                  <td>{incident.assignedTo?.name || 'Sin asignar'}</td>
                  <td className="min-w-72 space-y-2 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" className="bg-slate-700" onClick={() => setSelected(incident)}>Detalle</Button>
                      {((canManage && !['cerrado', 'inactivo'].includes(incident.status)) || (!canManage && incident.createdById === user?.id && incident.status === 'pendiente')) && (
                        <Button type="button" className="bg-slate-700" onClick={() => edit(incident)}>Editar</Button>
                      )}
                      {canManage && !['cerrado', 'inactivo'].includes(incident.status) && <Button type="button" className="bg-emerald-700" onClick={() => close(incident)}>Cerrar</Button>}
                    </div>
                    {canManage && (
                      <div className="grid gap-2 md:grid-cols-2">
                        <select className="rounded-md border border-slate-300 px-2 py-1 text-xs" value={incident.status} onChange={(event) => changeStatus(incident, event.target.value)}>
                          <option value="pendiente">pendiente</option>
                          <option value="en_proceso">en proceso</option>
                          <option value="cerrado">cerrado</option>
                          <option value="inactivo">inactivo</option>
                        </select>
                        <select className="rounded-md border border-slate-300 px-2 py-1 text-xs" disabled={['cerrado', 'inactivo'].includes(incident.status)} value={incident.assignedToId || ''} onChange={(event) => assign(incident, event.target.value)}>
                          <option value="">Sin responsable</option>
                          {assignees.map((assignee) => <option key={assignee.id} value={assignee.id}>{assignee.name}</option>)}
                        </select>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{selected.title}</h3>
              <p className="mt-2 text-sm text-slate-700">{selected.description}</p>
            </div>
            <Button type="button" className="bg-slate-500" onClick={() => setSelected(null)}>Cerrar detalle</Button>
          </div>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <p><strong>Categoría:</strong> {selected.category}</p>
            <p><strong>Prioridad:</strong> {selected.priority}</p>
            <p><strong>Estado:</strong> {selected.status}</p>
            <p><strong>Responsable:</strong> {selected.assignedTo?.name || 'Sin asignar'}</p>
            <p><strong>Creado por:</strong> {selected.createdBy?.name || 'N/A'}</p>
            <p><strong>Cierre:</strong> {selected.closedAt ? new Date(selected.closedAt).toLocaleString() : 'Pendiente'}</p>
            <p className="md:col-span-2"><strong>Observación técnica:</strong> {selected.technicalObservation || 'Sin observación'}</p>
          </div>
        </Card>
      )}
    </div>
  );
};
