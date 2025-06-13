import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import ticketService from '../services/tickets';
import userService from '../services/users';
import StatsCard from '../shared/StatsCard';
import { ChartBarIcon, TicketIcon, UserIcon } from '@heroicons/react/24/outline';
import TicketList from '../tickets/TicketList';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    assignedTickets: 0,
    openTickets: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        setLoading(true);
        
        const [ticketsData, agentsData] = await Promise.all([
          ticketService.getAll(user.token),
          userService.getAgents(user.token)
            .then(data => data.filter(a => a._id !== user._id))
            .catch(() => []) // Silently handle agent fetch errors
        ]);
        
        setTickets(ticketsData);
        setAgents(agentsData);
        
        setStats({
          totalTickets: ticketsData.length,
          assignedTickets: ticketsData.filter(t => t.assignedTo?._id === user._id).length,
          openTickets: ticketsData.filter(t => t.status === 'open').length
        });
      } catch (err) {
        setError('Failed to load dashboard data. Please refresh to try again.');
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token, user._id]);

  const handleAssignTicket = async (ticketId, agentId) => {
    try {
      setError('');
      const ticketToUpdate = tickets.find(t => t._id === ticketId);
      
      if (!ticketToUpdate) {
        throw new Error('Ticket not found');
      }

      const updateData = {
        _id: ticketId,
        assignedTo: agentId,
        status: agentId ? 'in-progress' : 'open',
        title: ticketToUpdate.title,
        description: ticketToUpdate.description,
        priority: ticketToUpdate.priority
      };

      const updatedTicket = await ticketService.update(updateData, user.token);
      
      setTickets(tickets.map(t => 
        t._id === ticketId ? updatedTicket : t
      ));
      
      setStats(prev => ({
        totalTickets: prev.totalTickets,
        assignedTickets: tickets.map(t => 
          t._id === ticketId ? 
            { ...t, assignedTo: agentId ? { _id: agentId } : null } : t
        ).filter(t => t.assignedTo?._id === user._id).length,
        openTickets: tickets.filter(t => 
          t._id === ticketId ? 
            (agentId ? t.status !== 'open' : t.status === 'open') : 
            t.status === 'open'
        ).length
      }));
    } catch (err) {
      setError(err.message || 'Failed to update ticket assignment');
      console.error('Assignment error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Agent Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium mb-4">All Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tickets found</p>
        ) : (
          <TicketList 
            tickets={tickets} 
            agents={agents} 
            currentUserId={user._id}
            onAssignTicket={handleAssignTicket}
            showAssignAction={true}
          />
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;