import express from 'express';
import { register, login } from '../controller/authController.js';

const router = express.Router();

// Matches: api.post('/auth/register', formData)
router.post('/register', register);

// Matches: api.post('/auth/login', formData)
router.post('/login', login);

export default router;