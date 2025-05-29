import { Request, Response } from 'express';

// Mock chat data (replace with database later)
const chats: any[] = [];

export const createChat = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, type } = req.body;

    const newChat = {
      id: chats.length + 1,
      userId,
      title,
      type,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chats.push(newChat);

    res.status(201).json({
      message: 'Chat created successfully',
      chat: newChat,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating chat' });
  }
};

export const getChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const chat = chats.find(
      c => c.id === parseInt(id) && c.userId === userId
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { content, role } = req.body;

    const chatIndex = chats.findIndex(
      c => c.id === parseInt(id) && c.userId === userId
    );

    if (chatIndex === -1) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = {
      id: chats[chatIndex].messages.length + 1,
      content,
      role,
      timestamp: new Date(),
    };

    chats[chatIndex].messages.push(message);
    chats[chatIndex].updatedAt = new Date();

    // In a real app, integrate with AI service here
    const aiResponse = {
      id: chats[chatIndex].messages.length + 1,
      content: 'This is a mock AI response. Replace with actual AI integration.',
      role: 'assistant',
      timestamp: new Date(),
    };

    chats[chatIndex].messages.push(aiResponse);

    res.json({
      message: 'Message sent successfully',
      messages: [message, aiResponse],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userChats = chats
      .filter(c => c.userId === userId)
      .map(chat => ({
        id: chat.id,
        title: chat.title,
        type: chat.type,
        lastMessage: chat.messages[chat.messages.length - 1],
        updatedAt: chat.updatedAt,
      }));

    res.json(userChats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const chatIndex = chats.findIndex(
      c => c.id === parseInt(id) && c.userId === userId
    );

    if (chatIndex === -1) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chats.splice(chatIndex, 1);

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting chat' });
  }
}; 