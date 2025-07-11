import { Router } from 'express';
import * as tasksController from '../controllers/tasksController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Protect all routes with authentication middleware
router.get('/', authenticateToken, tasksController.getTasks);
router.get('/:id', authenticateToken, tasksController.getTaskById);
router.post('/', authenticateToken, tasksController.createTask);
router.put('/:id', authenticateToken, tasksController.updateTask);
router.delete('/:id', authenticateToken, tasksController.deleteTask);

export default router;
