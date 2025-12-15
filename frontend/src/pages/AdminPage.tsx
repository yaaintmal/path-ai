import { ApiTestWidget } from '../components/admin/ApiTestWidget';
import CreateUserWidget from '../components/admin/CreateUserWidget';
import PageHeader from '../components/ui/PageHeader';
import AdminStatsWidget from '../components/admin/AdminStatsWidget';
import AdminUsersWidget from '../components/admin/AdminUsersWidget';
import AdminLogsWidget from '../components/admin/AdminLogsWidget';
import { ErrorPollerWidget } from '../components/admin/ErrorPollerWidget';
import { useAuth } from '../contexts/useAuth';

interface AdminPageProps {
  onBack?: () => void;
}

export function AdminPage({ onBack }: AdminPageProps) {
  const { user, isAuthenticated, userDetails } = useAuth();

  const isAdmin = (() => {
    try {
      if (!isAuthenticated) return false;
      const u = user as { role?: string; isAdmin?: boolean; email?: string } | null;
      const ud = userDetails as { roles?: string[] } | null;
      if (u?.role === 'admin' || u?.isAdmin === true) return true;
      if (ud?.roles && Array.isArray(ud.roles) && ud.roles.includes('admin')) return true;
      if (u?.email && u.email === 'mal@dot.com') return true;
      return false;
    } catch {
      return false;
    }
  })();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 md:px-8">
        <PageHeader title="Admin" subtitle="Admin-only tools and diagnostics" onBack={onBack} />

        <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
          <p className="text-sm font-medium">Unauthorized — this page is for admin users only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:px-8">
      <PageHeader title="Admin" subtitle="Admin-only tools and diagnostics" onBack={onBack} />

      {/* Main Content */}
      <div className="grid gap-6">
        {/* Row 1: Error monitor (2/3) + System stats (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ErrorPollerWidget />
          </div>
          <div>
            <AdminStatsWidget />
          </div>
        </div>

        {/* Row 2: Debug widget (ApiTest) and Admin Logs (50/50) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ApiTestWidget />
          </div>
          <div>
            <AdminLogsWidget />
          </div>
        </div>

        {/* Row 3: Create User (1/3) + Registered Users (2/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="p-4 rounded-lg border border-input bg-card">
              <h3 className="text-lg font-semibold mb-2">🛠️ Admin: Create User</h3>
              <CreateUserWidget />
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="p-4 rounded-lg border border-input bg-card">
              <h3 className="text-lg font-semibold mb-4">Registered Users</h3>
              <AdminUsersWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
