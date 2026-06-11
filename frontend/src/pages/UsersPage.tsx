import { FormEvent, useEffect, useMemo, useState } from 'react';
import { rolesApi } from '../api/roles.api';
import { usersApi } from '../api/users.api';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface Role {
  id: number;
  name: string;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  roleId: number;
  status: 'activo' | 'inactivo';
  role?: Role;
}

const emptyForm = { name: '', email: '', password: '', roleId: '', status: 'activo' };

export const UsersPage = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const selectedRoleId = useMemo(() => Number(form.roleId || roles[0]?.id || 0), [form.roleId, roles]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersResponse, rolesResponse] = await Promise.all([usersApi.list(), rolesApi.list()]);
      setUsers(usersResponse.data.data);
      setRoles(rolesResponse.data.data);
      if (!form.roleId && rolesResponse.data.data[0]) {
        setForm((current) => ({ ...current, roleId: String(rolesResponse.data.data[0].id) }));
      }
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cargar usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm, roleId: String(roles[0]?.id || '') });
  };

  const edit = (user: UserRow) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      roleId: String(user.roleId),
      status: user.status
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        roleId: selectedRoleId,
        status: form.status,
        ...(form.password ? { password: form.password } : {})
      };

      if (editingId) {
        await usersApi.update(editingId, payload);
        setMessage('Usuario actualizado correctamente.');
      } else {
        await usersApi.create({ ...payload, password: form.password });
        setMessage('Usuario creado correctamente.');
      }

      resetForm();
      await load();
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (user: UserRow) => {
    const nextStatus = user.status === 'activo' ? 'inactivo' : 'activo';
    if (nextStatus === 'inactivo' && !window.confirm(`¿Desactivar al usuario ${user.email}?`)) return;

    setError('');
    setMessage('');
    try {
      await usersApi.changeStatus(user.id, nextStatus);
      setMessage(`Usuario ${nextStatus === 'activo' ? 'activado' : 'desactivado'} correctamente.`);
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
            <h2 className="text-xl font-semibold text-slate-950">Usuarios</h2>
            <p className="text-sm text-slate-600">Administración de cuentas, roles y estado.</p>
          </div>
          <Button type="button" onClick={resetForm}>Nuevo usuario</Button>
        </div>
        <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submit}>
          <Alert message={error} />
          {message && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</div>}
          <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nombre" required />
          <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" required />
          <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={editingId ? 'Nueva contraseña opcional' : 'Contraseña'} required={!editingId} />
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.roleId} onChange={(event) => setForm({ ...form, roleId: event.target.value })} required>
            {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
          </select>
          <select className="rounded-md border border-slate-300 px-3 py-2 text-sm" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear usuario'}</Button>
            {editingId && <Button type="button" className="bg-slate-500" onClick={resetForm}>Cancelar</Button>}
          </div>
        </form>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr><th className="py-2">Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td className="py-4 text-slate-500" colSpan={5}>Cargando usuarios...</td></tr>}
              {!loading && users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="py-3 font-medium text-slate-900">{user.name}</td>
                  <td>{user.email}</td>
                  <td><Badge>{user.role?.name || 'Sin rol'}</Badge></td>
                  <td><Badge>{user.status}</Badge></td>
                  <td className="flex gap-2 py-2">
                    <Button type="button" className="bg-slate-700" onClick={() => edit(user)}>Editar</Button>
                    <Button type="button" className={user.status === 'activo' ? 'bg-red-700' : 'bg-emerald-700'} onClick={() => changeStatus(user)}>
                      {user.status === 'activo' ? 'Desactivar' : 'Activar'}
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
