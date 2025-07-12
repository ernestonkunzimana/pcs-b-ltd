import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';
import { validateRequest } from '../middleware/validation';
import { transactionValidation } from '../validation/transactionValidation';

const router = Router();
const transactionController = new TransactionController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/transactions
router.get(
  '/',
  checkPermission('transaction', 'read'),
  transactionController.index.bind(transactionController)
);

// GET /api/transactions/:id
router.get(
  '/:id',
  checkPermission('transaction', 'read'),
  transactionController.show.bind(transactionController)
);

// POST /api/transactions
router.post(
  '/',
  checkPermission('transaction', 'create'),
  validateRequest(transactionValidation.create),
  transactionController.store.bind(transactionController)
);

// PUT /api/transactions/:id
router.put(
  '/:id',
  checkPermission('transaction', 'update'),
  validateRequest(transactionValidation.update),
  transactionController.update.bind(transactionController)
);

// DELETE /api/transactions/:id
router.delete(
  '/:id',
  checkPermission('transaction', 'delete'),
  transactionController.destroy.bind(transactionController)
);

export default router;