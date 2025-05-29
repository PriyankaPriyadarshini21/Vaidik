import express from 'express';
import {
  createSupportTicket,
  getSupportTickets,
  getSupportTicketById,
} from '../controllers/supportController';

const router = express.Router();

// Create a new support ticket
router.post('/tickets', createSupportTicket);

// Get all support tickets for the current user
router.get('/tickets', getSupportTickets);

// Get a specific support ticket by ID
router.get('/tickets/:id', getSupportTicketById);

export default router; 