import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('No fue posible crear el usuario.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="text-2xl font-semibold text-slate-950">Registro</h1>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Alert message={error} />
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nombre" required />
            <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" required />
            <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Contraseña" required />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creando...' : 'Crear cuenta'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            ¿Ya tiene cuenta? <Link className="font-medium text-slate-900" to="/login">Ingresar</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
