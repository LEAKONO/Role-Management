import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../dashboard/AdminDashboard';  
import AgentDashboard from '../dashboard/AgentDashboard'; 
import UserDashboard from '../dashboard/UserDashboard';   

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'agent') return <AgentDashboard />;
  return <UserDashboard />;
};

export default Dashboard;