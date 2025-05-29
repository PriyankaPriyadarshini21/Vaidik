import express from 'express';
import { 
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  getAllDocuments,
  shareDocument
} from '../controllers/document.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { documentSchema } from '../middleware/validationSchemas';

const router = express.Router();

// Protected routes
router.use(authenticate);

// Document routes
router.post('/', validateRequest(documentSchema), createDocument);
router.get('/', getAllDocuments);
router.get('/:id', getDocument);
router.put('/:id', validateRequest(documentSchema), updateDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/share', shareDocument);

export const documentRoutes = router; 