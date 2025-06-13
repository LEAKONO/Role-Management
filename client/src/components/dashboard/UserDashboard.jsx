import { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext"; // ✅ correct
import ticketService from '../services/tickets';
import TicketList from '../tickets/TicketList';

const UserDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getAll(user.token);
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium mb-4">My Tickets</h2>
        <TicketList tickets={tickets} />
      </div>
    </div>
  );
};

export default UserDashboard;