import { useEffect, useState } from 'react';
import { usersApi } from '../api/users.api';
import { Card } from '../components/ui/Card';

export const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    usersApi.list().then((response) => setUsers(response.data.data));
  }, []);

  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-950">Usuarios</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr><th className="py-2">Nombre</th><th>Email</th><th>Rol</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="py-2">{user.name}</td><td>{user.email}</td><td>{user.role?.name}</td><td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
