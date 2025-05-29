import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
  }),
});

export const documentSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    content: z.string(),
    type: z.enum(['legal', 'contract', 'other']),
  }),
});

export const chatSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    type: z.enum(['legal', 'general']),
  }),
});

export const messageSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    role: z.enum(['user', 'assistant']),
  }),
}); 