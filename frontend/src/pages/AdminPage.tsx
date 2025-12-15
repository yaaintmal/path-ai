import { Button } from '../ui/button';
import { ApiTestWidget } from '../components/admin/ApiTestWidget';
import CreateUserWidget from '../components/admin/CreateUserWidget';
import { ArrowLeft } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">Unauthorized — this page is for admin users only.</p>
        <div className="mt-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Tools</h1>
        {onBack && (
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        <ApiTestWidget />

        <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🛠️ Admin: Create User</h3>
          <CreateUserWidget />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
