import { Router } from 'express';
import { AuditLogController } from '../controllers/AuditLogController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';

const router = Router();
const auditLogController = new AuditLogController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/audit-logs
router.get(
  '/',
  checkPermission('audit_log', 'read'),
  auditLogController.index.bind(auditLogController)
);

// GET /api/audit-logs/:id
router.get(
  '/:id',
  checkPermission('audit_log', 'read'),
  auditLogController.show.bind(auditLogController)
);

// GET /api/audit-logs/table/:tableName
router.get(
  '/table/:tableName',
  checkPermission('audit_log', 'read'),
  auditLogController.getByTable.bind(auditLogController)
);

// GET /api/audit-logs/user/:userId
router.get(
  '/user/:userId',
  checkPermission('audit_log', 'read'),
  auditLogController.getByUser.bind(auditLogController)
);

export default router;