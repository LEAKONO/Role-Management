import { useState } from 'react';
import { 
  CheckCircleIcon, 
  ArrowPathIcon, 
  EnvelopeIcon,
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800'
};

const statusIcons = {
  open: <EnvelopeIcon className="h-5 w-5" />,
  'in-progress': <ArrowPathIcon className="h-5 w-5" />,
  resolved: <CheckCircleIcon className="h-5 w-5" />
};

const statusColors = {
  open: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800'
};

const TicketCard = ({
  ticket,
  isExpanded,
  onToggleExpand,
  agents,
  currentUserId,
  onAssignTicket,
  onStatusChange,
  showAssignAction,
  showStatusAction,
  adminView
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const handleAssign = async (agentId) => {
    setIsAssigning(true);
    try {
      await onAssignTicket(ticket._id, agentId);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsChangingStatus(true);
    try {
      await onStatusChange(ticket._id, newStatus);
    } finally {
      setIsChangingStatus(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
              <div className="flex items-center space-x-1">
                {statusIcons[ticket.status]}
                <span>{ticket.status}</span>
              </div>
            </span>
            <h3 className="text-lg font-medium">{ticket.title}</h3>
          </div>
          <button 
            onClick={() => onToggleExpand(ticket._id)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div className="text-gray-700">
              <p>{ticket.description}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <UserIcon className="h-4 w-4" />
                <span>
                  {ticket.assignedTo ? 
                    `Assigned to: ${ticket.assignedTo.name}` : 
                    'Unassigned'}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ClockIcon className="h-4 w-4" />
                <span>
                  Created: {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {(showAssignAction || showStatusAction) && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {showAssignAction && (
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`assign-${ticket._id}`} className="text-sm font-medium text-gray-700">
                      Assign to:
                    </label>
                    <select
                      id={`assign-${ticket._id}`}
                      value={ticket.assignedTo?._id || ''}
                      onChange={(e) => handleAssign(e.target.value || null)}
                      disabled={isAssigning}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Unassigned</option>
                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name} {agent._id === currentUserId ? '(Me)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {showStatusAction && (
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`status-${ticket._id}`} className="text-sm font-medium text-gray-700">
                      Status:
                    </label>
                    <select
                      id={`status-${ticket._id}`}
                      value={ticket.status}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      disabled={isChangingStatus}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {ticket.comment && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Latest Comment</h4>
                <p className="text-gray-600 text-sm">{ticket.comment}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCard;