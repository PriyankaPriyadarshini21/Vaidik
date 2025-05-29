import express from 'express';
import { 
  createChat,
  getChat,
  sendMessage,
  getChatHistory,
  deleteChat
} from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { chatSchema, messageSchema } from '../middleware/validationSchemas';

const router = express.Router();

// Protected routes
router.use(authenticate);

// Chat routes
router.post('/', validateRequest(chatSchema), createChat);
router.get('/', getChatHistory);
router.get('/:id', getChat);
router.post('/:id/messages', validateRequest(messageSchema), sendMessage);
router.delete('/:id', deleteChat);

export const chatRoutes = router; 