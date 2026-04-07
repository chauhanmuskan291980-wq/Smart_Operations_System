import express from 'express';
import { getTasks, createTask, updateTaskStatus } from '../controller/taskController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All task routes require a valid login
router.use(verifyToken);

// GET: Accessible by everyone (controller handles filtering)
router.get('/', getTasks);

// POST: Admin/Manager only
router.post('/', checkRole(['ADMIN', 'MANAGER']), createTask);

// PATCH: Everyone can update status
router.patch('/:id/status', updateTaskStatus);

export default router;