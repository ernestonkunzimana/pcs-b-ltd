import { Router } from 'express';
import { SystemLogController } from '../controllers/SystemLogController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';

const router = Router();
const systemLogController = new SystemLogController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/system-logs
router.get(
  '/',
  checkPermission('system_log', 'read'),
  systemLogController.index.bind(systemLogController)
);

// GET /api/system-logs/:id
router.get(
  '/:id',
  checkPermission('system_log', 'read'),
  systemLogController.show.bind(systemLogController)
);

// GET /api/system-logs/level/:level
router.get(
  '/level/:level',
  checkPermission('system_log', 'read'),
  systemLogController.getByLevel.bind(systemLogController)
);

// GET /api/system-logs/module/:module
router.get(
  '/module/:module',
  checkPermission('system_log', 'read'),
  systemLogController.getByModule.bind(systemLogController)
);

export default router;