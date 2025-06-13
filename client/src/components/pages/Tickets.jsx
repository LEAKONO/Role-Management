import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ticketService from '../services/tickets';
import TicketList from '../components/tickets/TicketList';
import TicketForm from '../components/tickets/TicketForm';
import { PlusIcon } from '@heroicons/react/24/outline';

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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

  const handleNewTicket = (newTicket) => {
    setTickets([newTicket, ...tickets]);
    setShowForm(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tickets</h1>
        {user.role !== 'user' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Ticket
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <TicketForm onSuccess={handleNewTicket} />
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <TicketList tickets={tickets} />
      </div>
    </div>
  );
};

export default Tickets;