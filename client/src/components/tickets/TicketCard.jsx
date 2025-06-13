import { useState } from 'react';
import { formatDate } from '../utils/helpers';

const TicketCard = ({ ticket, agents, currentUserId, onAssignTicket, showAssignAction }) => {
  const [isAssigning, setIsAssigning] = useState(false);
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

  const handleAssign = async (agentId) => {
    setIsAssigning(true);
    try {
      await onAssignTicket(ticket._id, agentId);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {ticket.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Created by {ticket.createdBy?.username} on {formatDate(ticket.createdAt)}
          </p>
          {ticket.assignedTo && (
            <p className="mt-1 text-sm text-gray-500">
              Currently assigned to: <span className="font-medium">{ticket.assignedTo?.username}</span>
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="flex gap-2">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>
              {ticket.status}
            </span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[ticket.priority]}`}>
              {ticket.priority}
            </span>
          </div>
          
          {showAssignAction && (
            <div className="w-full sm:w-48">
              <label htmlFor={`assign-${ticket._id}`} className="sr-only">Assign to</label>
              <select
                id={`assign-${ticket._id}`}
                value={ticket.assignedTo?._id || ''}
                onChange={(e) => handleAssign(e.target.value)}
                disabled={isAssigning}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Unassigned</option>
                <option value={currentUserId}>Assign to me</option>
                <optgroup label="Other Agents">
                  {agents.filter(a => a._id !== currentUserId).map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.username}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;