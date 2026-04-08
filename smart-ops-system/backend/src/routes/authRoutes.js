import express from 'express';
import { register, login ,getUsers,updateUser,deleteUser } from '../controller/authController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';
const router = express.Router();

// Matches: api.post('/auth/register', formData)
router.post('/register', register);

// Matches: api.post('/auth/login', formData)
router.post('/login', login);

router.get('/', verifyToken,checkRole(['ADMIN', 'MANAGER']), getUsers);
router.put('/:id',verifyToken,checkRole(['ADMIN', 'MANAGER']), updateUser);
router.delete('/:id',verifyToken,checkRole(['ADMIN', 'MANAGER']), deleteUser);

export default router;