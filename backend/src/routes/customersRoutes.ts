import { Router } from 'express';
import { getCustomers } from '../controllers/customersController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/customers', authenticateToken, getCustomers);

export default router;
