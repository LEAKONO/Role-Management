import TicketCard from './TicketCard';

const TicketList = ({ tickets, agents, currentUserId, onAssignTicket, showAssignAction }) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tickets found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map(ticket => (
        <TicketCard 
          key={ticket._id} 
          ticket={ticket} 
          agents={agents}
          currentUserId={currentUserId}
          onAssignTicket={onAssignTicket}
          showAssignAction={showAssignAction}
        />
      ))}
    </div>
  );
};

export default TicketList;