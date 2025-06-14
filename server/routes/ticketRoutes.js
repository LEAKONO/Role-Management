import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController.js';
import { protect, admin, adminOrAgent } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

router.route('/:id')
  .get(protect, getTicketById)
  .put(protect, adminOrAgent, updateTicket)
  .delete(protect, admin, deleteTicket); // Changed to admin-only

export default router;