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
  TrashIcon
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
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, tickets] = await Promise.all([
          userService.getAll(currentUser.token),
          ticketService.getAll(currentUser.token)
        ]);
        
        setStats({
          totalUsers: usersData.length,
          totalTickets: tickets.length,
          openTickets: tickets.filter(t => t.status === 'open').length
        });
        
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.token]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.remove(userId, currentUser.token);
        setUsers(users.filter(user => user._id !== userId));
        setStats(prev => ({...prev, totalUsers: prev.totalUsers - 1}));
        toast.success('User deleted successfully');
      } catch (err) {
        console.error('Delete error:', err);
        toast.error(err.response?.data?.message || err.message || 'Failed to delete user');
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditFormData({
      username: user.username,
      email: user.email,
      role: user.role
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (userId) => {
    try {
      const updatedUser = await userService.update(
        { _id: userId, ...editFormData },
        currentUser.token
      );
      
      setUsers(users.map(user => 
        user._id === userId ? updatedUser : user
      ));
      
      setEditingUserId(null);
      toast.success('User updated successfully');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || 'Failed to update user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
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
                        value={editFormData.username}
                        onChange={handleEditFormChange}
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
                        value={editFormData.email}
                        onChange={handleEditFormChange}
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
                        value={editFormData.role}
                        onChange={handleEditFormChange}
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
                          onClick={() => handleEditSubmit(userItem._id)}
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
                          onClick={() => handleEditClick(userItem)}
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
    </div>
  );
};

export default AdminDashboard;