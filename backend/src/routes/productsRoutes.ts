import { Router } from 'express';
import { getProducts } from '../controllers/productsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/products', authenticateToken, getProducts);

export default router;
