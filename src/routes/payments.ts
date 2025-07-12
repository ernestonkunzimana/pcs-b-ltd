import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';
import { validateRequest } from '../middleware/validation';
import { paymentValidation } from '../validation/paymentValidation';

const router = Router();
const paymentController = new PaymentController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/payments
router.get(
  '/',
  checkPermission('payment', 'read'),
  paymentController.index.bind(paymentController)
);

// GET /api/payments/:id
router.get(
  '/:id',
  checkPermission('payment', 'read'),
  paymentController.show.bind(paymentController)
);

// POST /api/payments
router.post(
  '/',
  checkPermission('payment', 'create'),
  validateRequest(paymentValidation.create),
  paymentController.store.bind(paymentController)
);

// PUT /api/payments/:id
router.put(
  '/:id',
  checkPermission('payment', 'update'),
  validateRequest(paymentValidation.update),
  paymentController.update.bind(paymentController)
);

// DELETE /api/payments/:id
router.delete(
  '/:id',
  checkPermission('payment', 'delete'),
  paymentController.destroy.bind(paymentController)
);

export default router;