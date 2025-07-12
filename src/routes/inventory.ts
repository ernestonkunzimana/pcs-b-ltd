import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { authenticateJWT } from '../middleware/auth';
import { checkPermission } from '../middleware/permission';
import { validateRequest } from '../middleware/validation';
import { inventoryValidation } from '../validation/inventoryValidation';

const router = Router();
const inventoryController = new InventoryController();

// Apply authentication to all routes
router.use(authenticateJWT);

// GET /api/inventory
router.get(
  '/',
  checkPermission('inventory', 'read'),
  inventoryController.index.bind(inventoryController)
);

// GET /api/inventory/:id
router.get(
  '/:id',
  checkPermission('inventory', 'read'),
  inventoryController.show.bind(inventoryController)
);

// POST /api/inventory
router.post(
  '/',
  checkPermission('inventory', 'create'),
  validateRequest(inventoryValidation.create),
  inventoryController.store.bind(inventoryController)
);

// PUT /api/inventory/:id
router.put(
  '/:id',
  checkPermission('inventory', 'update'),
  validateRequest(inventoryValidation.update),
  inventoryController.update.bind(inventoryController)
);

// DELETE /api/inventory/:id
router.delete(
  '/:id',
  checkPermission('inventory', 'delete'),
  inventoryController.destroy.bind(inventoryController)
);

// GET /api/inventory/low-stock
router.get(
  '/low-stock',
  checkPermission('inventory', 'read'),
  inventoryController.getLowStock.bind(inventoryController)
);

export default router;