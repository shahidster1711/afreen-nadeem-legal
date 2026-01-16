import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import SubmissionsTable from '@/components/admin/SubmissionsTable';
import { Scale, LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container-legal flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/">
                <Home className="h-4 w-4 mr-2" />
                Website
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-legal py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Contact Submissions</h2>
            <p className="text-muted-foreground">
              Manage and respond to client enquiries. Click on a submission to view details and update status.
            </p>
          </div>
          
          <SubmissionsTable />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
