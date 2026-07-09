import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth.api';
import { SESSION_TOKEN_KEY } from '../api/session';

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
  status: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(SESSION_TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    if (!localStorage.getItem(SESSION_TOKEN_KEY)) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.me();
      setUser(response.data.data);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const onExpired = () => clearSession();
    window.addEventListener('sisia:session-expired', onExpired);
    return () => window.removeEventListener('sisia:session-expired', onExpired);
  }, [clearSession]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email: email.trim().toLowerCase(), password });
    const nextToken = response.data.data.token;
    localStorage.setItem(SESSION_TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(response.data.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    await authApi.register({ name, email, password });
    await login(email, password);
  };

  const logout = async () => {
    try {
      if (localStorage.getItem(SESSION_TOKEN_KEY)) {
        await authApi.logout();
      }
    } catch {
      // El cierre local debe ejecutarse aunque el token ya no sea válido.
    } finally {
      clearSession();
      window.location.href = '/login';
    }
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, refreshUser: loadUser }), [user, token, loading, loadUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
