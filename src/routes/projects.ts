import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';
import { validateRequest } from '../middleware/validation';
import { projectValidation } from '../validation/projectValidation';

const router = Router();
const projectController = new ProjectController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/projects
router.get(
  '/',
  checkPermission('project', 'read'),
  projectController.index.bind(projectController)
);

// GET /api/projects/:id
router.get(
  '/:id',
  checkPermission('project', 'read'),
  projectController.show.bind(projectController)
);

// POST /api/projects
router.post(
  '/',
  checkPermission('project', 'create'),
  validateRequest(projectValidation.create),
  projectController.store.bind(projectController)
);

// PUT /api/projects/:id
router.put(
  '/:id',
  checkPermission('project', 'update'),
  validateRequest(projectValidation.update),
  projectController.update.bind(projectController)
);

// DELETE /api/projects/:id
router.delete(
  '/:id',
  checkPermission('project', 'delete'),
  projectController.destroy.bind(projectController)
);

export default router;