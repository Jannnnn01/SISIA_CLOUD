import { FormEvent, useEffect, useState } from 'react';
import { assetsApi } from '../api/assets.api';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface AssetRow {
  id: number;
  name: string;
  type: string;
  description: string | null;
  owner: string;
  confidentialityLevel: string;
  integrityLevel: string;
  availabilityLevel: string;
  status: 'activo' | 'inactivo';
}

const emptyForm = {
  name: '',
  type: 'Información',
  description: '',
  owner: '',
  confidentialityLevel: 'medio',
  integrityLevel: 'medio',
  availabilityLevel: 'medio',
  status: 'activo'
};

export const AssetsPage = () => {
  const [assets, setAssets] = useState<AssetRow[]>([]);
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
      const response = await assetsApi.list();
      setAssets(response.data.data);
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cargar activos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const edit = (asset: AssetRow) => {
    setEditingId(asset.id);
    setForm({
      name: asset.name,
      type: asset.type,
      description: asset.description || '',
      owner: asset.owner,
      confidentialityLevel: asset.confidentialityLevel,
      integrityLevel: asset.integrityLevel,
      availabilityLevel: asset.availabilityLevel,
      status: asset.status
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await assetsApi.update(editingId, form);
        setMessage('Activo actualizado correctamente.');
      } else {
        await assetsApi.create(form);
        setMessage('Activo creado correctamente.');
      }
      resetForm();
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible guardar el activo.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (asset: AssetRow) => {
    const nextStatus = asset.status === 'activo' ? 'inactivo' : 'activo';
    if (nextStatus === 'inactivo' && !window.confirm(`¿Inactivar el activo ${asset.name}?`)) return;

    setError('');
    setMessage('');
    try {
      await assetsApi.changeStatus(asset.id, nextStatus);
      setMessage(`Activo ${nextStatus === 'activo' ? 'activado' : 'inactivado'} correctamente.`);
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
            <h2 className="text-xl font-semibold text-slate-950">{editingId ? 'Editar activo' : 'Crear activo'}</h2>
            <p className="text-sm text-slate-600">Inventario de activos de información académicos.</p>
          </div>
          {editingId && <Button type="button" className="bg-slate-500" onClick={resetForm}>Nuevo activo</Button>}
        </div>
        <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <Alert message={error} />
          {message && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
          <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nombre" required />
          <Input value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} placeholder="Tipo" required />
          <Input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} placeholder="Propietario" required />
          <Input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descripción" />
          <LevelSelect label="Confidencialidad" value={form.confidentialityLevel} onChange={(value) => setForm({ ...form, confidentialityLevel: value })} />
          <LevelSelect label="Integridad" value={form.integrityLevel} onChange={(value) => setForm({ ...form, integrityLevel: value })} />
          <LevelSelect label="Disponibilidad" value={form.availabilityLevel} onChange={(value) => setForm({ ...form, availabilityLevel: value })} />
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
          <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar activo' : 'Guardar activo'}</Button>
        </form>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr><th className="py-2">Activo</th><th>Tipo</th><th>Propietario</th><th>C/I/D</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td className="py-4 text-slate-500" colSpan={6}>Cargando activos...</td></tr>}
              {!loading && assets.map((asset) => (
                <tr key={asset.id} className="border-t border-slate-100">
                  <td className="py-3"><p className="font-medium text-slate-900">{asset.name}</p><p className="text-xs text-slate-500">{asset.description || 'Sin descripción'}</p></td>
                  <td>{asset.type}</td>
                  <td>{asset.owner}</td>
                  <td>{asset.confidentialityLevel}/{asset.integrityLevel}/{asset.availabilityLevel}</td>
                  <td><Badge>{asset.status}</Badge></td>
                  <td className="flex gap-2 py-2">
                    <Button type="button" className="bg-slate-700" onClick={() => edit(asset)}>Editar</Button>
                    <Button type="button" className={asset.status === 'activo' ? 'bg-red-700' : 'bg-emerald-700'} onClick={() => changeStatus(asset)}>
                      {asset.status === 'activo' ? 'Inactivar' : 'Activar'}
                    </Button>
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

const LevelSelect = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
  <select aria-label={label} className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={value} onChange={(event) => onChange(event.target.value)}>
    <option value="bajo">{label}: bajo</option>
    <option value="medio">{label}: medio</option>
    <option value="alto">{label}: alto</option>
  </select>
);
