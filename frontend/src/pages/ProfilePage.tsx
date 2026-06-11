import { FormEvent, useEffect, useState } from 'react';
import { authApi } from '../api/auth.api';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [error, setError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
  }, [user?.name]);

  const updateProfile = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setProfileMessage('');
    if (!name.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (name.trim().length > 120) {
      setError('El nombre no puede superar 120 caracteres.');
      return;
    }

    setSavingProfile(true);
    try {
      await authApi.updateProfile({ name: name.trim() });
      await refreshUser();
      setProfileMessage('Perfil actualizado correctamente.');
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible actualizar el perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setPasswordMessage('');
    if (!currentPassword || !newPassword) {
      setError('Debe ingresar la contraseña actual y la nueva contraseña.');
      return;
    }
    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('La confirmación de contraseña no coincide.');
      return;
    }

    setSavingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('Contraseña actualizada correctamente.');
    } catch (apiError: any) {
      setError(apiError?.response?.data?.message || 'No fue posible cambiar la contraseña.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <h2 className="text-xl font-semibold text-slate-950">Perfil</h2>
        <p className="mt-1 text-sm text-slate-600">Información básica de la cuenta.</p>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Rol:</strong> {user?.role?.name}</p>
          <p><strong>Estado:</strong> {user?.status}</p>
        </div>
        <form className="mt-5 space-y-3" onSubmit={updateProfile}>
          <Alert message={error} />
          {profileMessage && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{profileMessage}</div>}
          <Input value={name} maxLength={120} onChange={(event) => setName(event.target.value)} placeholder="Nombre" required />
          <Button type="submit" disabled={savingProfile}>{savingProfile ? 'Guardando...' : 'Actualizar perfil'}</Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-slate-950">Cambiar contraseña</h2>
        <p className="mt-1 text-sm text-slate-600">Valide su contraseña actual antes de definir una nueva.</p>
        <form className="mt-5 space-y-3" onSubmit={changePassword}>
          {passwordMessage && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{passwordMessage}</div>}
          <Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Contraseña actual" required />
          <Input type="password" value={newPassword} minLength={8} onChange={(event) => setNewPassword(event.target.value)} placeholder="Nueva contraseña" required />
          <Input type="password" value={confirmPassword} minLength={8} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirmar nueva contraseña" required />
          <Button type="submit" disabled={savingPassword}>{savingPassword ? 'Actualizando...' : 'Cambiar contraseña'}</Button>
        </form>
      </Card>
    </div>
  );
};
