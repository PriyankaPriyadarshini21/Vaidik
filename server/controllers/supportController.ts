import { Request, Response } from 'express';
import { supportTicketSchema, SupportTicket } from '../models/support';

// In-memory storage for support tickets (replace with database in production)
let supportTickets: SupportTicket[] = [];

export const createSupportTicket = async (req: Request, res: Response) => {
  console.log('Received support ticket request:', req.body);
  try {
    const ticketData = supportTicketSchema.parse({
      ...req.body,
      userId: req.user?.id || 'anonymous', // Assuming you have user authentication
    });

    console.log('Parsed ticket data:', ticketData);

    const newTicket: SupportTicket = {
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    supportTickets.push(newTicket);
    console.log('Created new ticket:', newTicket);

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: newTicket,
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getSupportTickets = async (req: Request, res: Response) => {
  console.log('Fetching support tickets for user:', req.user?.id || 'anonymous');
  try {
    const userId = req.user?.id || 'anonymous';
    const userTickets = supportTickets.filter(ticket => ticket.userId === userId);

    res.status(200).json({
      success: true,
      data: userTickets,
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support tickets',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getSupportTicketById = async (req: Request, res: Response) => {
  console.log('Fetching support ticket by ID:', req.params.id);
  try {
    const ticketId = req.params.id;
    const userId = req.user?.id || 'anonymous';
    
    const ticket = supportTickets.find(
      t => t.userId === userId && t.id === ticketId
    );

    if (!ticket) {
      console.log('Ticket not found');
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support ticket',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}; 