import Ticket from '../models/Ticket.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a ticket
// @route   POST /api/tickets
// @access  Protected
const createTicket = asyncHandler(async (req, res) => {
  const { title, description, priority } = req.body;

  const ticket = await Ticket.create({
    title,
    description,
    priority,
    createdBy: req.user._id,
    status: 'open',
  });

  res.status(201).json(ticket);
});

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Protected
const getTickets = asyncHandler(async (req, res) => {
  const query = Ticket.find({})
    .populate('createdBy', 'username avatar')
    .populate('assignedTo', 'username avatar');

  const tickets = await query.sort({ createdAt: -1 });
  res.json(tickets);
});

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Protected
const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', 'username avatar')
    .populate('assignedTo', 'username avatar');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  res.json(ticket);
});

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Protected (Admin/Agent with restrictions)
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', '_id')
    .populate('assignedTo', '_id');

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  const { assignedTo, status, title, description, priority, comment } = req.body;
  const isAdmin = req.user.role === 'admin';
  const isAgent = req.user.role === 'agent';
  const isCreator = ticket.createdBy._id.toString() === req.user._id.toString();
  const isAssigned = ticket.assignedTo?._id.toString() === req.user._id.toString();

  // Agents can assign tickets (to themselves or others)
  if (assignedTo && isAgent) {
    ticket.assignedTo = assignedTo;
    ticket.status = status || 'in-progress';
  }

  // Admin/creator can update all fields
  if (isAdmin || isCreator) {
    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.priority = priority || ticket.priority;
    ticket.status = status || ticket.status;
  }

  // Assigned agent can update status
  if (isAssigned) {
    ticket.status = status || ticket.status;
  }

  if (comment) {
    ticket.comments.push({
      text: comment,
      postedBy: req.user._id,
      createdAt: new Date()
    });
  }

  const updatedTicket = await ticket.save();
  res.json(updatedTicket);
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Protected (Admin only)
const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete tickets');
  }

  await ticket.deleteOne();
  res.json({ message: 'Ticket removed' });
});

export { 
  createTicket, 
  getTickets, 
  getTicketById, 
  updateTicket, 
  deleteTicket 
};