import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { BrandLogo } from '../components/layout/BrandLogo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'No fue posible iniciar sesión. Verifique la API y sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">
        <Card>
          <BrandLogo size="lg" />
          <p className="mt-4 text-sm text-slate-600">Acceso seguro al sistema académico</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Alert message={error} />
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Contraseña" required />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Validando...' : 'Ingresar'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            ¿No tiene cuenta? <Link className="font-medium text-slate-900" to="/register">Registrarse</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
