import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AgentDashboard from '../components/dashboard/AgentDashboard';
import UserDashboard from '../components/dashboard/UserDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'agent') return <AgentDashboard />;
  return <UserDashboard />;
};

export default Dashboard;