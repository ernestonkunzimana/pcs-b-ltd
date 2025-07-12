import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';
import { validateRequest } from '../middleware/validation';
import { invoiceValidation } from '../validation/invoiceValidation';

const router = Router();
const invoiceController = new InvoiceController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/invoices
router.get(
  '/',
  checkPermission('invoice', 'read'),
  invoiceController.index.bind(invoiceController)
);

// GET /api/invoices/:id
router.get(
  '/:id',
  checkPermission('invoice', 'read'),
  invoiceController.show.bind(invoiceController)
);

// POST /api/invoices
router.post(
  '/',
  checkPermission('invoice', 'create'),
  validateRequest(invoiceValidation.create),
  invoiceController.store.bind(invoiceController)
);

// PUT /api/invoices/:id
router.put(
  '/:id',
  checkPermission('invoice', 'update'),
  validateRequest(invoiceValidation.update),
  invoiceController.update.bind(invoiceController)
);

// DELETE /api/invoices/:id
router.delete(
  '/:id',
  checkPermission('invoice', 'delete'),
  invoiceController.destroy.bind(invoiceController)
);

export default router;