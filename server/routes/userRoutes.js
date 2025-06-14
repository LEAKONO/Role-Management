import express from 'express';
import {
  getUsers,
  getAgents,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { protect, admin, adminOrAgent } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getUsers);

router.route('/agents')
  .get(protect, adminOrAgent, getAgents); // Changed to adminOrAgent

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

export default router;