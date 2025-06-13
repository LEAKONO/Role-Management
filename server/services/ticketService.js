import Ticket from '../models/Ticket.js';
import ApiError from '../utils/ApiError.js';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants.js';

export const createTicket = async (ticketData) => {
  return await Ticket.create(ticketData);
};

export const getTickets = async (userId, userRole) => {
  let query = {};
  
  if (userRole === 'user') {
    query.createdBy = userId;
  } else if (userRole === 'agent') {
    query.$or = [
      { assignedTo: userId },
      { status: 'open' }
    ];
  }
  
  return await Ticket.find(query)
    .populate('createdBy', 'username email')
    .populate('assignedTo', 'username email');
};

export const getTicketById = async (ticketId) => {
  const ticket = await Ticket.findById(ticketId)
    .populate('createdBy', 'username email')
    .populate('assignedTo', 'username email');
  
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }
  
  return ticket;
};

export const updateTicket = async (ticketId, updateData, userId, userRole) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }

  if (userRole === 'user' && ticket.createdBy.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to update this ticket');
  }

  Object.assign(ticket, updateData);
  await ticket.save();

  return ticket;
};

export const deleteTicket = async (ticketId, userId, userRole) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new ApiError(404, 'Ticket not found');
  }

  if (userRole !== 'admin' && ticket.createdBy.toString() !== userId) {
    throw new ApiError(403, 'Not authorized to delete this ticket');
  }

  await ticket.remove();
  return ticket;
};