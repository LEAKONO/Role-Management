import TicketCard from './TicketCard';

const TicketList = ({ tickets }) => {
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
        <TicketCard key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketList;