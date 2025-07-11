import { Router } from 'express';
import { getPayments, getPaymentById, createPayment } from '../controllers/paymentsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/payments', authenticateToken, getPayments);
router.get('/payments/:id', authenticateToken, getPaymentById);
router.post('/payments', authenticateToken, createPayment);

export default router;
