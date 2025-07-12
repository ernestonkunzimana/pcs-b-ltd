import { Router } from 'express';
import { ESGMetricController } from '../controllers/ESGMetricController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';
import { validateRequest } from '../middleware/validation';
import { esgMetricValidation } from '../validation/esgMetricValidation';

const router = Router();
const esgMetricController = new ESGMetricController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/esg-metrics
router.get(
  '/',
  checkPermission('esg_metric', 'read'),
  esgMetricController.index.bind(esgMetricController)
);

// GET /api/esg-metrics/:id
router.get(
  '/:id',
  checkPermission('esg_metric', 'read'),
  esgMetricController.show.bind(esgMetricController)
);

// POST /api/esg-metrics
router.post(
  '/',
  checkPermission('esg_metric', 'create'),
  validateRequest(esgMetricValidation.create),
  esgMetricController.store.bind(esgMetricController)
);

// PUT /api/esg-metrics/:id
router.put(
  '/:id',
  checkPermission('esg_metric', 'update'),
  validateRequest(esgMetricValidation.update),
  esgMetricController.update.bind(esgMetricController)
);

// DELETE /api/esg-metrics/:id
router.delete(
  '/:id',
  checkPermission('esg_metric', 'delete'),
  esgMetricController.destroy.bind(esgMetricController)
);

// GET /api/esg-metrics/type/:type
router.get(
  '/type/:type',
  checkPermission('esg_metric', 'read'),
  esgMetricController.getByType.bind(esgMetricController)
);

// GET /api/esg-metrics/project/:projectId
router.get(
  '/project/:projectId',
  checkPermission('esg_metric', 'read'),
  esgMetricController.getByProject.bind(esgMetricController)
);

export default router;