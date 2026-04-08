import express from 'express';
import { register, login ,getUsers,updateUser,deleteUser } from '../controller/authController.js';

const router = express.Router();

// Matches: api.post('/auth/register', formData)
router.post('/register', register);

// Matches: api.post('/auth/login', formData)
router.post('/login', login);

router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;