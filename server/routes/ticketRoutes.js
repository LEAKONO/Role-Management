import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController.js';
import { protect, adminOrAgent } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getTickets)
  .post(protect, createTicket);

router
  .route('/:id')
  .get(protect, getTicketById)
  .put(protect, adminOrAgent, updateTicket)
  .delete(protect, adminOrAgent, deleteTicket); // Optionally protect delete too

export default router;
