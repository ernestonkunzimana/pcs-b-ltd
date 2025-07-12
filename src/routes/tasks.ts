import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';
import { validateRequest } from '../middleware/validation';
import { taskValidation } from '../validation/taskValidation';

const router = Router();
const taskController = new TaskController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/tasks
router.get(
  '/',
  checkPermission('task', 'read'),
  taskController.index.bind(taskController)
);

// GET /api/tasks/:id
router.get(
  '/:id',
  checkPermission('task', 'read'),
  taskController.show.bind(taskController)
);

// POST /api/tasks
router.post(
  '/',
  checkPermission('task', 'create'),
  validateRequest(taskValidation.create),
  taskController.store.bind(taskController)
);

// PUT /api/tasks/:id
router.put(
  '/:id',
  checkPermission('task', 'update'),
  validateRequest(taskValidation.update),
  taskController.update.bind(taskController)
);

// DELETE /api/tasks/:id
router.delete(
  '/:id',
  checkPermission('task', 'delete'),
  taskController.destroy.bind(taskController)
);

// GET /api/tasks/project/:projectId
router.get(
  '/project/:projectId',
  checkPermission('task', 'read'),
  taskController.getByProject.bind(taskController)
);

// GET /api/tasks/assignee/:assigneeId
router.get(
  '/assignee/:assigneeId',
  checkPermission('task', 'read'),
  taskController.getByAssignee.bind(taskController)
);

export default router;