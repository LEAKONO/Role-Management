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
    query = Ticket.find({})
      .populate('createdBy', 'username avatar')
      .populate('assignedTo', 'username avatar');
  } else if (req.user.role === 'agent') {
    query = Ticket.find({
      $or: [
        { assignedTo: req.user._id },
        { status: 'open' }
      ]
    })
      .populate('createdBy', 'username avatar')
      .populate('assignedTo', 'username avatar');
  } else {
    query = Ticket.find({ createdBy: req.user._id })
      .populate('createdBy', 'username avatar')
      .populate('assignedTo', 'username avatar');
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

  const canView = (
    req.user.role === 'admin' ||
    ticket.createdBy._id.toString() === req.user._id.toString() ||
    (ticket.assignedTo && ticket.assignedTo._id.toString() === req.user._id.toString())
  );

  if (!canView) {
    res.status(403);
    throw new Error('Not authorized to view this ticket');
  }

  res.json(ticket);
});

const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', '_id')
    .populate('assignedTo', '_id');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  // Authorization Logic
  const isAdmin = req.user.role === 'admin';
  const isCreator = ticket.createdBy._id.toString() === req.user._id.toString();
  const isAssigned = ticket.assignedTo?._id.toString() === req.user._id.toString();
  const isAgent = req.user.role === 'agent';
  const isAssigning = req.body.assignedTo;

  // Allow update if:
  // - Admin
  // - Creator
  // - Assigned agent
  // - Agent trying to assign/reassign (even if not currently assigned)
  const canUpdate = isAdmin || isCreator || isAssigned || (isAgent && isAssigning);

  if (!canUpdate) {
    res.status(403);
    throw new Error('Not authorized to update this ticket');
  }

  // Handle assignment changes
  if (req.body.assignedTo && (isAdmin || isAgent)) {
    ticket.assignedTo = req.body.assignedTo;
    if (req.body.status && ['open', 'in-progress'].includes(req.body.status)) {
      ticket.status = req.body.status;
    } else if (!ticket.status || ticket.status === 'open') {
      ticket.status = 'in-progress';
    }
  }

  // Field-specific permissions
  if (isAdmin || isCreator) {
    ticket.title = req.body.title || ticket.title;
    ticket.description = req.body.description || ticket.description;
  }

  if (isAdmin || isCreator || isAssigned) {
    ticket.status = req.body.status || ticket.status;
    ticket.priority = req.body.priority || ticket.priority;
  }

  if (req.body.comment) {
    ticket.comments.push({
      text: req.body.comment,
      postedBy: req.user._id,
      createdAt: new Date()
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
    res.status(403);
    throw new Error('Not authorized to delete this ticket');
  }

  await ticket.remove();
  res.json({ message: 'Ticket removed' });
});

export { createTicket, getTickets, getTicketById, updateTicket, deleteTicket };