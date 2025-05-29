import { z } from 'zod';

export const supportTicketSchema = z.object({
  userId: z.string(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  status: z.enum(['open', 'in-progress', 'resolved']).default('open'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export type SupportTicket = z.infer<typeof supportTicketSchema>; 