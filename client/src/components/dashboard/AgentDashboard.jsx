import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import ticketService from '../services/tickets';
import userService from '../services/users';
import StatsCard from '../shared/StatsCard';
import { 
  ChartBarIcon, 
  TicketIcon, 
  UserIcon, 
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import TicketList from '../tickets/TicketList';
import TicketForm from '../tickets/TicketForm';
import Modal from '../shared/Modal';
import { toast } from 'react-toastify';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    assignedToMe: 0,
    openTickets: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setError('');
      setLoading(true);
      setRefreshing(true);
      
      const [ticketsData, agentsData] = await Promise.all([
        ticketService.getAll(user.token),
        userService.getAgents(user.token)
      ]);

      // Include current user in agents list for self-assignment
      const allAgents = [...agentsData, { _id: user._id, name: 'Me', email: user.email }];
      
      setTickets(ticketsData);
      setAgents(allAgents);

      setStats({
        totalTickets: ticketsData.length,
        assignedToMe: ticketsData.filter(t => t.assignedTo?._id === user._id).length,
        openTickets: ticketsData.filter(t => t.status === 'open').length,
        inProgress: ticketsData.filter(t => t.status === 'in-progress').length
      });

    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.token]);

  const handleAssignTicket = async (ticketId, agentId) => {
    try {
      const ticketToUpdate = tickets.find(t => t._id === ticketId);
      if (!ticketToUpdate) throw new Error('Ticket not found');

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

      const action = agentId ? 
        (agentId === user._id ? 'assigned to yourself' : 'assigned to another agent') : 
        'unassigned';
      toast.success(`Ticket ${action}`);
      fetchData(); // Refresh stats
    } catch (err) {
      toast.error(err.message || 'Assignment failed');
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const ticketToUpdate = tickets.find(t => t._id === ticketId);
      if (!ticketToUpdate) throw new Error('Ticket not found');

      const updateData = {
        _id: ticketId,
        assignedTo: ticketToUpdate.assignedTo?._id,
        status: newStatus,
        title: ticketToUpdate.title,
        description: ticketToUpdate.description,
        priority: ticketToUpdate.priority
      };

      const updatedTicket = await ticketService.update(updateData, user.token);
      
      setTickets(tickets.map(t => 
        t._id === ticketId ? updatedTicket : t
      ));

      toast.success(`Status updated to ${newStatus}`);
      fetchData(); // Refresh stats
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleTicketCreated = (newTicket) => {
    setTickets([newTicket, ...tickets]);
    setShowTicketForm(false);
    toast.success('Ticket created');
    fetchData(); // Refresh stats
  };

  const filteredTickets = () => {
    switch(filter) {
      case 'my':
        return tickets.filter(t => t.assignedTo?._id === user._id);
      case 'open':
        return tickets.filter(t => t.status === 'open');
      default:
        return tickets;
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
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agent Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center px-3 py-2 border rounded-md text-sm font-medium"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowTicketForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Ticket
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard 
          title="Total Tickets" 
          value={stats.totalTickets} 
          icon={<TicketIcon className="h-6 w-6" />} 
        />
        <StatsCard 
          title="Assigned to Me" 
          value={stats.assignedToMe} 
          icon={<UserIcon className="h-6 w-6" />}
        />
        <StatsCard 
          title="Open Tickets" 
          value={stats.openTickets} 
          icon={<TicketIcon className="h-6 w-6" />}
        />
        <StatsCard 
          title="In Progress" 
          value={stats.inProgress} 
          icon={<ChartBarIcon className="h-6 w-6" />}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Tickets</h2>
          <div className="flex space-x-2">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Tickets</option>
                <option value="my">My Tickets</option>
                <option value="open">Open Tickets</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <TicketList 
          tickets={filteredTickets()} 
          agents={agents} 
          currentUserId={user._id}
          onAssignTicket={handleAssignTicket}
          onStatusChange={handleStatusChange}
          showAssignAction={true}
          showStatusAction={true}
        />
      </div>

      <Modal isOpen={showTicketForm} onClose={() => setShowTicketForm(false)}>
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Create New Ticket</h2>
          <TicketForm 
            onTicketCreated={handleTicketCreated} 
            onCancel={() => setShowTicketForm(false)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AgentDashboard;