import { useState } from 'react';
import TicketCard from './TicketCard';

const TicketList = ({ 
  tickets, 
  agents, 
  currentUserId,
  onAssignTicket,
  onStatusChange,
  showAssignAction = false,
  showStatusAction = false
}) => {
  const [expandedTicketId, setExpandedTicketId] = useState(null);

  const toggleExpand = (ticketId) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <TicketCard
          key={ticket._id}
          ticket={ticket}
          isExpanded={expandedTicketId === ticket._id}
          onToggleExpand={toggleExpand}
          agents={agents}
          currentUserId={currentUserId}
          onAssignTicket={onAssignTicket}
          onStatusChange={onStatusChange}
          showAssignAction={showAssignAction}
          showStatusAction={showStatusAction}
        />
      ))}
    </div>
  );
};

export default TicketList;