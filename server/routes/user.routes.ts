import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  deleteProfile,
  getAllUsers,
  getUserById
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { updateProfileSchema } from '../middleware/validationSchemas';

const router = express.Router();

// Protected routes
router.use(authenticate);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', validateRequest(updateProfileSchema), updateProfile);
router.delete('/profile', deleteProfile);

// Admin routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);

export const userRoutes = router; 