import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/users';
import UserManagement from '../components/users/UserManagement';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll(user.token);
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <UserManagement users={users} />
    </div>
  );
};

export default Users;