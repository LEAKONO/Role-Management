import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

const TicketCard = ({ ticket }) => {
  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-yellow-100 text-yellow-800',
    critical: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            <Link to={`/tickets/${ticket._id}`} className="hover:text-indigo-600">
              {ticket.title}
            </Link>
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Created on {formatDate(ticket.createdAt)}
          </p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>
            {ticket.status}
          </span>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[ticket.priority]}`}>
            {ticket.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;