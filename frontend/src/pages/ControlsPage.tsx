import { FormEvent, useEffect, useState } from 'react';
import { controlsApi } from '../api/controls.api';
import { risksApi } from '../api/risks.api';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface RiskRow {
  id: number;
  threat: string;
  riskLevel: string;
  status: string;
}

interface ControlRow {
  id: number;
  riskId: number;
  name: string;
  description: string | null;
  type: string;
  status: 'activo' | 'inactivo' | 'pendiente' | 'implementado';
  risk?: RiskRow;
}

const emptyForm = {
  riskId: '',
  name: '',
  description: '',
  type: 'preventivo',
  status: 'activo'
};

export const ControlsPage = () => {
  const [controls, setControls] = useState<ControlRow[]>([]);
  const [risks, setRisks] = useState<RiskRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [controlsResponse, risksResponse] = await Promise.all([controlsApi.list(), risksApi.list()]);
      const activeRisks = risksResponse.data.data.filter((risk: RiskRow) => risk.status === 'activo');
      setControls(controlsResponse.data.data);
      setRisks(activeRisks);
      if (!form.riskId && activeRisks[0]) {
        setForm((current) => ({ ...current, riskId: String(activeRisks[0].id) }));
      }
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cargar controles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, riskId: String(risks[0]?.id || '') });
  };

  const edit = (control: ControlRow) => {
    setEditingId(control.id);
    setForm({
      riskId: String(control.riskId),
      name: control.name,
      description: control.description || '',
      type: control.type,
      status: control.status
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = { ...form, riskId: Number(form.riskId) };
      if (editingId) {
        await controlsApi.update(editingId, payload);
        setMessage('Control actualizado correctamente.');
      } else {
        await controlsApi.create(payload);
        setMessage('Control creado correctamente.');
      }
      resetForm();
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible guardar el control.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (control: ControlRow, status: string) => {
    if (status === 'inactivo' && !window.confirm(`¿Inactivar el control ${control.name}?`)) return;
    setError('');
    setMessage('');
    try {
      await controlsApi.changeStatus(control.id, status);
      setMessage('Estado del control actualizado correctamente.');
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cambiar el estado.');
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">{editingId ? 'Editar control' : 'Crear control'}</h2>
            <p className="text-sm text-slate-600">Controles asociados a riesgos de seguridad.</p>
          </div>
          {editingId && <Button type="button" className="bg-slate-500" onClick={resetForm}>Nuevo control</Button>}
        </div>
        <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <Alert message={error} />
          {message && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.riskId} onChange={(event) => setForm({ ...form, riskId: event.target.value })} required>
            <option value="">Seleccione riesgo</option>
            {risks.map((risk) => <option key={risk.id} value={risk.id}>{risk.threat} · {risk.riskLevel}</option>)}
          </select>
          <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nombre del control" required />
          <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descripción" />
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option value="preventivo">preventivo</option>
            <option value="detectivo">detectivo</option>
            <option value="correctivo">correctivo</option>
          </select>
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="activo">activo</option>
            <option value="pendiente">pendiente</option>
            <option value="implementado">implementado</option>
            <option value="inactivo">inactivo</option>
          </select>
          <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar control' : 'Guardar control'}</Button>
        </form>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr><th className="py-2">Control</th><th>Riesgo</th><th>Tipo</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td className="py-4 text-slate-500" colSpan={5}>Cargando controles...</td></tr>}
              {!loading && controls.map((control) => (
                <tr key={control.id} className="border-t border-slate-100">
                  <td className="py-3"><p className="font-medium text-slate-900">{control.name}</p><p className="text-xs text-slate-500">{control.description || 'Sin descripción'}</p></td>
                  <td>{control.risk?.threat || 'N/A'}</td>
                  <td>{control.type}</td>
                  <td><Badge>{control.status}</Badge></td>
                  <td className="flex flex-wrap gap-2 py-2">
                    <Button type="button" className="bg-slate-700" onClick={() => edit(control)}>Editar</Button>
                    <select className="rounded-md border border-slate-300 px-2 py-1 text-xs" value={control.status} onChange={(event) => changeStatus(control, event.target.value)}>
                      <option value="activo">activo</option>
                      <option value="pendiente">pendiente</option>
                      <option value="implementado">implementado</option>
                      <option value="inactivo">inactivo</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
