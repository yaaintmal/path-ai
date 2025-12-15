import { useState } from 'react';
import { getApiUrl } from '../../config/app.config';
import { UserPlus } from 'lucide-react';

export function CreateUserWidget() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('user');
  const [result, setResult] = useState<string>('');

  const createUser = async () => {
    setResult('');
    if (password.length < 8) {
      setResult('Error: password must be at least 8 characters');
      return;
    }
    try {
      const token = window.localStorage.getItem('authToken');
      const res = await fetch(getApiUrl('/api/users/admin/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name,
          email,
          password,
          roles: roles.split(',').map((r) => r.trim()),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.issues && Array.isArray(data.issues)) {
          const details = (data.issues as Array<{ path?: string; message?: string }>)
            .map((i) => `${i.path || '<unknown>'}: ${i.message || '<no message>'}`)
            .join('; ');
          setResult(`Error: ${data?.message || res.status} — ${details}`);
        } else {
          setResult(`Error: ${data?.message || res.status}`);
        }
        return;
      }
      setResult(`Created: ${data.email} (${data.id})`);
      setName('');
      setEmail('');
      setPassword('');
      setRoles('user');
    } catch (err) {
      setResult(`Exception: ${String(err)}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input
        className="p-2 rounded border"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="p-2 rounded border"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="p-2 rounded border"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="p-2 rounded border"
        placeholder="Roles (comma separated)"
        value={roles}
        onChange={(e) => setRoles(e.target.value)}
      />
      <div className="col-span-full flex items-center gap-2">
        <button
          onClick={createUser}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          aria-label="Create user"
          title="Create user"
        >
          <UserPlus className="size-4" />
          <span>Create User</span>
        </button>
        {result && <div className="text-sm font-mono">{result}</div>}
      </div>
    </div>
  );
}

export default CreateUserWidget;
