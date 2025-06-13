import Ticket from '../models/Ticket.js';
import asyncHandler from 'express-async-handler';


const createTicket = asyncHandler(async (req, res) => {
  const { title, description, priority } = req.body;

  const ticket = await Ticket.create({
    title,
    description,
    priority,
    createdBy: req.user._id,
    status: 'open',
  });

  if (ticket) {
    res.status(201).json(ticket);
  } else {
    res.status(400);
    throw new Error('Invalid ticket data');
  }
});


const getTickets = asyncHandler(async (req, res) => {
  let query;

  if (req.user.role === 'admin') {
    query = Ticket.find({}).populate('createdBy', 'username avatar');
  } 
  else if (req.user.role === 'agent') {
    query = Ticket.find({
      $or: [
        { assignedTo: req.user._id },
        { status: 'open' }
      ]
    }).populate('createdBy', 'username avatar');
  } 
  else {
    query = Ticket.find({ createdBy: req.user._id }).populate('createdBy', 'username avatar');
  }

  const tickets = await query.sort({ createdAt: -1 });
  res.json(tickets);
});


const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', 'username avatar')
    .populate('assignedTo', 'username avatar');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (
    req.user.role !== 'admin' &&
    ticket.createdBy._id.toString() !== req.user._id.toString() &&
    (ticket.assignedTo && ticket.assignedTo._id.toString() !== req.user._id.toString())
  ) {
    res.status(401);
    throw new Error('Not authorized to view this ticket');
  }

  res.json(ticket);
});


const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (
    req.user.role !== 'admin' &&
    ticket.createdBy.toString() !== req.user._id.toString() &&
    (ticket.assignedTo && ticket.assignedTo.toString() !== req.user._id.toString())
  ) {
    res.status(401);
    throw new Error('Not authorized to update this ticket');
  }

  if (req.body.assignedTo && (req.user.role === 'admin' || req.user.role === 'agent')) {
    ticket.assignedTo = req.body.assignedTo;
  }

  ticket.title = req.body.title || ticket.title;
  ticket.description = req.body.description || ticket.description;
  ticket.status = req.body.status || ticket.status;
  ticket.priority = req.body.priority || ticket.priority;

  if (req.body.comment) {
    ticket.comments.push({
      text: req.body.comment,
      postedBy: req.user._id,
    });
  }

  const updatedTicket = await ticket.save();

  res.json(updatedTicket);
});


const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (req.user.role !== 'admin' && ticket.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this ticket');
  }

  await ticket.remove();
  res.json({ message: 'Ticket removed' });
});

export { createTicket, getTickets, getTicketById, updateTicket, deleteTicket };