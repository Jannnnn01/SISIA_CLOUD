import { FormEvent, useEffect, useState } from 'react';
import { assetsApi } from '../api/assets.api';
import { risksApi } from '../api/risks.api';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface AssetRow {
  id: number;
  name: string;
  status: string;
}

interface RiskRow {
  id: number;
  assetId: number;
  threat: string;
  vulnerability: string;
  probability: number;
  impact: number;
  riskScore: number;
  riskLevel: string;
  mitigationPlan: string | null;
  status: 'activo' | 'inactivo';
  asset?: AssetRow;
}

const emptyForm = {
  assetId: '',
  threat: '',
  vulnerability: '',
  probability: '3',
  impact: '3',
  mitigationPlan: '',
  status: 'activo'
};

export const RisksPage = () => {
  const [risks, setRisks] = useState<RiskRow[]>([]);
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
      const [risksResponse, assetsResponse] = await Promise.all([risksApi.list(), assetsApi.list()]);
      const activeAssets = assetsResponse.data.data.filter((asset: AssetRow) => asset.status === 'activo');
      setRisks(risksResponse.data.data);
      setAssets(activeAssets);
      if (!form.assetId && activeAssets[0]) {
        setForm((current) => ({ ...current, assetId: String(activeAssets[0].id) }));
      }
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cargar riesgos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, assetId: String(assets[0]?.id || '') });
  };

  const edit = (risk: RiskRow) => {
    setEditingId(risk.id);
    setForm({
      assetId: String(risk.assetId),
      threat: risk.threat,
      vulnerability: risk.vulnerability,
      probability: String(risk.probability),
      impact: String(risk.impact),
      mitigationPlan: risk.mitigationPlan || '',
      status: risk.status
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        assetId: Number(form.assetId),
        threat: form.threat,
        vulnerability: form.vulnerability,
        probability: Number(form.probability),
        impact: Number(form.impact),
        mitigationPlan: form.mitigationPlan,
        status: form.status
      };

      if (editingId) {
        await risksApi.update(editingId, payload);
        setMessage('Riesgo actualizado correctamente.');
      } else {
        await risksApi.create(payload);
        setMessage('Riesgo creado correctamente.');
      }
      resetForm();
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible guardar el riesgo.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (risk: RiskRow) => {
    const nextStatus = risk.status === 'activo' ? 'inactivo' : 'activo';
    if (nextStatus === 'inactivo' && !window.confirm(`¿Inactivar el riesgo ${risk.threat}?`)) return;
    setError('');
    setMessage('');
    try {
      await risksApi.changeStatus(risk.id, nextStatus);
      setMessage(`Riesgo ${nextStatus === 'activo' ? 'activado' : 'inactivado'} correctamente.`);
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
            <h2 className="text-xl font-semibold text-slate-950">{editingId ? 'Editar riesgo' : 'Crear riesgo'}</h2>
            <p className="text-sm text-slate-600">Evaluación de amenazas y vulnerabilidades por activo.</p>
          </div>
          {editingId && <Button type="button" className="bg-slate-500" onClick={resetForm}>Nuevo riesgo</Button>}
        </div>
        <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <Alert message={error} />
          {message && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.assetId} onChange={(event) => setForm({ ...form, assetId: event.target.value })} required>
            <option value="">Seleccione activo</option>
            {assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.name}</option>)}
          </select>
          <Input value={form.threat} onChange={(event) => setForm({ ...form, threat: event.target.value })} placeholder="Amenaza" required />
          <Input value={form.vulnerability} onChange={(event) => setForm({ ...form, vulnerability: event.target.value })} placeholder="Vulnerabilidad" required />
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.probability} onChange={(event) => setForm({ ...form, probability: event.target.value })}>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>Probabilidad {value}</option>)}
          </select>
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.impact} onChange={(event) => setForm({ ...form, impact: event.target.value })}>
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>Impacto {value}</option>)}
          </select>
          <Input value={form.mitigationPlan} onChange={(event) => setForm({ ...form, mitigationPlan: event.target.value })} placeholder="Plan de mitigación" />
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
          <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar riesgo' : 'Guardar riesgo'}</Button>
        </form>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr><th className="py-2">Riesgo</th><th>Activo</th><th>Prob.</th><th>Impacto</th><th>Score</th><th>Nivel</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td className="py-4 text-slate-500" colSpan={8}>Cargando riesgos...</td></tr>}
              {!loading && risks.map((risk) => (
                <tr key={risk.id} className="border-t border-slate-100">
                  <td className="py-3"><p className="font-medium text-slate-900">{risk.threat}</p><p className="text-xs text-slate-500">{risk.vulnerability}</p></td>
                  <td>{risk.asset?.name || 'N/A'}</td>
                  <td>{risk.probability}</td>
                  <td>{risk.impact}</td>
                  <td>{risk.riskScore}</td>
                  <td><Badge>{risk.riskLevel}</Badge></td>
                  <td><Badge>{risk.status}</Badge></td>
                  <td className="flex gap-2 py-2">
                    <Button type="button" className="bg-slate-700" onClick={() => edit(risk)}>Editar</Button>
                    <Button type="button" className={risk.status === 'activo' ? 'bg-red-700' : 'bg-emerald-700'} onClick={() => changeStatus(risk)}>
                      {risk.status === 'activo' ? 'Inactivar' : 'Activar'}
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
