import { Router } from 'express';
import * as tasksController from '../controllers/tasksController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, tasksController.getTasks);
router.post('/', authenticateToken, tasksController.createTask);

export default router;
