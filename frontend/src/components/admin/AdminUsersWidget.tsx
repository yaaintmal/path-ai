import { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../ui/dialog';
import { getApiUrl } from '../../config/app.config';

type UserRow = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  lastActivity?: string | null;
};

export function AdminUsersWidget() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [rolesDraft, setRolesDraft] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(getApiUrl('/api/users/admin/all'), { credentials: 'include' });
      if (!res.ok) {
        let msg = 'Failed to fetch users';
        try {
          const text = await res.text();
          try {
            const body = JSON.parse(text);
            if (body && body.message) msg = body.message;
            else msg = `Invalid response. First 500 chars: ${text.slice(0, 500)}`;
          } catch {
            msg = `Invalid response. First 500 chars: ${text.slice(0, 500)}`;
          }
        } catch {
          /* ignore */
        }
        throw new Error(msg);
      }
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveRoles = async (id: string) => {
    const draft = rolesDraft[id];
    if (draft === undefined) return;
    const roles = draft
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);
    try {
      const res = await fetch(getApiUrl(`/api/users/admin/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roles }),
      });
      if (!res.ok) throw new Error('Failed to update roles');
      // reload list
      await load();
      setEditing((s) => ({ ...s, [id]: false }));
    } catch (err) {
      setError(String(err));
    }
  };

  const deleteUser = async (id: string) => {
    // open confirmation modal for this user
    const toDelete = users.find((u) => u.id === id) || null;
    setConfirmUser(toDelete);
  };

  const [confirmUser, setConfirmUser] = useState<UserRow | null>(null);

  const confirmDelete = async () => {
    if (!confirmUser) return;
    try {
      const res = await fetch(getApiUrl(`/api/users/admin/${confirmUser.id}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setConfirmUser(null);
      await load();
    } catch (err) {
      setError(String(err));
    }
  };

  if (loading)
    return <div className="p-4 rounded-lg border border-input bg-card">Loading users…</div>;
  if (error)
    return (
      <div className="p-4 rounded-lg border border-input bg-card text-destructive">
        Error: {error}
      </div>
    );

  const ICON_BTN_CLASS = 'rounded hover:text-amber-500 hover:bg-amber-500/10 transition-colors p-1';

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Roles</th>
              <th className="pb-2">Last action</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">
                  {editing[u.id] ? (
                    <div className="flex gap-2 items-center">
                      <input
                        value={rolesDraft[u.id] ?? u.roles.join(',')}
                        onChange={(e) => setRolesDraft((s) => ({ ...s, [u.id]: e.target.value }))}
                        className="p-1 rounded border text-sm"
                      />
                      <button
                        onClick={() => saveRoles(u.id)}
                        className="px-2 py-1 bg-primary text-white rounded text-xs"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing((s) => ({ ...s, [u.id]: false }))}
                        className="px-2 py-1 bg-muted rounded text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <span className="font-medium">{u.roles.join(', ')}</span>
                      <button
                        onClick={() => {
                          setEditing((s) => ({ ...s, [u.id]: true }));
                          setRolesDraft((s) => ({ ...s, [u.id]: u.roles.join(',') }));
                        }}
                        className={ICON_BTN_CLASS}
                        aria-label={`Edit roles for ${u.name}`}
                        title={`Edit roles for ${u.name}`}
                      >
                        <Edit className="size-4" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-2">
                  {u.lastActivity ? new Date(u.lastActivity).toLocaleString() : '—'}
                </td>
                <td className="py-2">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className={`${ICON_BTN_CLASS} bg-red-500 text-white hover:bg-red-600`}
                    aria-label={`Delete ${u.name}`}
                    title={`Delete ${u.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={!!confirmUser} onOpenChange={(open) => !open && setConfirmUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user{' '}
              <span className="font-medium">{confirmUser?.name}</span>? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setConfirmUser(null)}
              className="px-3 py-1 rounded bg-muted text-sm"
              aria-label="Cancel delete"
            >
              Cancel
            </button>
            <button
              onClick={() => void confirmDelete()}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
              aria-label="Confirm delete"
            >
              <Trash2 className="size-4" />
              <span>Delete user</span>
            </button>
          </DialogFooter>
          <DialogClose />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminUsersWidget;
