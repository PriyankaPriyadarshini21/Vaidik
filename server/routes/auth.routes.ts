import express from 'express';
import { login, register, logout, refreshToken } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, registerSchema } from '../middleware/validationSchemas';

const router = express.Router();

// Auth routes
router.post('/login', validateRequest(loginSchema), login);
router.post('/register', validateRequest(registerSchema), register);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

export const authRoutes = router; 