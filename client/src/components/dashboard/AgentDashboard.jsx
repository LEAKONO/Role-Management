import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext"; // ✅ correct
import ticketService from '../services/tickets';
import StatsCard from '../shared/StatsCard';
import { ChartBarIcon, TicketIcon, UserIcon } from '@heroicons/react/24/outline';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTickets: 0,
    assignedTickets: 0,
    openTickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tickets = await ticketService.getAll(user.token);
        setStats({
          totalTickets: tickets.length,
          assignedTickets: tickets.filter(t => t.assignedTo?._id === user._id).length,
          openTickets: tickets.filter(t => t.status === 'open').length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Agent Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Tickets" 
          value={stats.totalTickets} 
          icon={<TicketIcon className="h-6 w-6" />} 
          color="bg-blue-100 text-blue-800"
        />
        <StatsCard 
          title="Assigned to Me" 
          value={stats.assignedTickets} 
          icon={<UserIcon className="h-6 w-6" />} 
          color="bg-green-100 text-green-800"
        />
        <StatsCard 
          title="Open Tickets" 
          value={stats.openTickets} 
          icon={<ChartBarIcon className="h-6 w-6" />} 
          color="bg-yellow-100 text-yellow-800"
        />
      </div>
    </div>
  );
};

export default AgentDashboard;