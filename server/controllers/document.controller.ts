import { Request, Response } from 'express';

// Mock document data (replace with database later)
const documents: any[] = [];

export const createDocument = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, content, type } = req.body;

    const newDocument = {
      id: documents.length + 1,
      userId,
      title,
      content,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    documents.push(newDocument);

    res.status(201).json({
      message: 'Document created successfully',
      document: newDocument,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating document' });
  }
};

export const getDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = documents.find(d => d.id === parseInt(id));

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document' });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { title, content, type } = req.body;

    const documentIndex = documents.findIndex(
      d => d.id === parseInt(id) && d.userId === userId
    );

    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    documents[documentIndex] = {
      ...documents[documentIndex],
      title: title || documents[documentIndex].title,
      content: content || documents[documentIndex].content,
      type: type || documents[documentIndex].type,
      updatedAt: new Date(),
    };

    res.json({
      message: 'Document updated successfully',
      document: documents[documentIndex],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const documentIndex = documents.findIndex(
      d => d.id === parseInt(id) && d.userId === userId
    );

    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    documents.splice(documentIndex, 1);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document' });
  }
};

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userDocuments = documents.filter(d => d.userId === userId);

    res.json(userDocuments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

export const shareDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { shareWithUserId } = req.body;

    const document = documents.find(
      d => d.id === parseInt(id) && d.userId === userId
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // In a real app, implement document sharing logic here
    res.json({ message: 'Document shared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sharing document' });
  }
}; 