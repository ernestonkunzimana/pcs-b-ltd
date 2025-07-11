import { Router } from 'express';
import * as invoicesController from '../controllers/invoicesController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticateToken, invoicesController.getInvoices);
router.get('/:id', authenticateToken, invoicesController.getInvoiceById);
router.post('/', authenticateToken, invoicesController.createInvoice);
router.delete('/:id', authenticateToken, invoicesController.deleteInvoice);

export default router;
