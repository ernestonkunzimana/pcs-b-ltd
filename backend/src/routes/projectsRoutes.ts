import { Router } from 'express';
import * as projectsController from '../controllers/projectsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, projectsController.getProjects);
router.get('/:id', authenticateToken, projectsController.getProjectById);
router.post('/', authenticateToken, projectsController.createProject);
router.put('/:id', authenticateToken, projectsController.updateProject);
router.delete('/:id', authenticateToken, projectsController.deleteProject);

export default router;
