import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import userService from '../services/users';
import ticketService from '../services/tickets';
import StatsCard from '../shared/StatsCard';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  TicketIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0
  });
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User editing state
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEditForm, setUserEditForm] = useState({
    username: '',
    email: '',
    role: 'user'
  });
  
  // Ticket editing state
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [ticketEditForm, setTicketEditForm] = useState({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, ticketsData] = await Promise.all([
          userService.getAll(currentUser.token),
          ticketService.getAll(currentUser.token)
        ]);
        
        setStats({
          totalUsers: usersData.length,
          totalTickets: ticketsData.length,
          openTickets: ticketsData.filter(t => t.status === 'open').length
        });
        
        setUsers(usersData);
        setTickets(ticketsData);
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.token]);

  // User management handlers
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.remove(userId, currentUser.token);
        setUsers(users.filter(user => user._id !== userId));
        setStats(prev => ({...prev, totalUsers: prev.totalUsers - 1}));
        toast.success('User deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        toast.error(err.message || 'Failed to delete user');
      }
    }
  };

  const handleUserEditClick = (user) => {
    setEditingUserId(user._id);
    setUserEditForm({
      username: user.username,
      email: user.email,
      role: user.role
    });
  };

  const handleUserEditSubmit = async (userId) => {
    try {
      const updatedUser = await userService.update(
        { _id: userId, ...userEditForm },
        currentUser.token
      );
      
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
      
      setEditingUserId(null);
      toast.success('User updated successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update user');
    }
  };

  // Ticket management handlers
  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketService.delete(ticketId, currentUser.token);
        const deletedTicket = tickets.find(t => t._id === ticketId);
        setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        setStats(prev => ({
          ...prev,
          totalTickets: prev.totalTickets - 1,
          openTickets: prev.openTickets - (deletedTicket?.status === 'open' ? 1 : 0)
        }));
        toast.success('Ticket deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        toast.error(err.message || 'Failed to delete ticket');
      }
    }
  };

  const handleTicketEditClick = (ticket) => {
    setEditingTicketId(ticket._id);
    setTicketEditForm({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority
    });
  };

  const handleTicketEditSubmit = async (ticketId) => {
    try {
      const updatedTicket = await ticketService.update(
        { _id: ticketId, ...ticketEditForm },
        currentUser.token
      );
      
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? updatedTicket : ticket
      ));
      
      // Update stats if status changed
      const originalTicket = tickets.find(t => t._id === ticketId);
      if (ticketEditForm.status !== originalTicket?.status) {
        setStats(prev => ({
          ...prev,
          openTickets: ticketEditForm.status === 'open' 
            ? prev.openTickets + 1 
            : prev.openTickets - 1
        }));
      }
      
      setEditingTicketId(null);
      toast.success('Ticket updated successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update ticket');
    }
  };

  const handleFormChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'user') {
      setUserEditForm({
        ...userEditForm,
        [name]: value
      });
    } else {
      setTicketEditForm({
        ...ticketEditForm,
        [name]: value
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingTicketId(null);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<UserGroupIcon className="h-6 w-6" />} 
          color="bg-blue-100 text-blue-800"
        />
        <StatsCard 
          title="Total Tickets" 
          value={stats.totalTickets} 
          icon={<TicketIcon className="h-6 w-6" />} 
          color="bg-green-100 text-green-800"
        />
        <StatsCard 
          title="Open Tickets" 
          value={stats.openTickets} 
          icon={<ChartBarIcon className="h-6 w-6" />} 
          color="bg-yellow-100 text-yellow-800"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-4 border-b">User Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userItem) => (
                <tr key={userItem._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === userItem._id ? (
                      <input
                        type="text"
                        name="username"
                        value={userEditForm.username}
                        onChange={(e) => handleFormChange(e, 'user')}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{userItem.username}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === userItem._id ? (
                      <input
                        type="email"
                        name="email"
                        value={userEditForm.email}
                        onChange={(e) => handleFormChange(e, 'user')}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{userItem.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUserId === userItem._id ? (
                      <select
                        name="role"
                        value={userEditForm.role}
                        onChange={(e) => handleFormChange(e, 'user')}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                          userItem.role === 'agent' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {userItem.role}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingUserId === userItem._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUserEditSubmit(userItem._id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUserEditClick(userItem)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(userItem._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          disabled={userItem._id === currentUser._id}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
        <h2 className="text-xl font-semibold p-4 border-b">Ticket Management</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTicketId === ticket._id ? (
                      <input
                        type="text"
                        name="title"
                        value={ticketEditForm.title}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingTicketId === ticket._id ? (
                      <textarea
                        name="description"
                        value={ticketEditForm.description}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        className="border rounded px-2 py-1 w-full"
                        rows="3"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{ticket.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTicketId === ticket._id ? (
                      <select
                        name="status"
                        value={ticketEditForm.status}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                          ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {ticket.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingTicketId === ticket._id ? (
                      <select
                        name="priority"
                        value={ticketEditForm.priority}
                        onChange={(e) => handleFormChange(e, 'ticket')}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {ticket.priority}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingTicketId === ticket._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTicketEditSubmit(ticket._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Save"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900"
                          title="Cancel"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleTicketEditClick(ticket)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTicket(ticket._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;