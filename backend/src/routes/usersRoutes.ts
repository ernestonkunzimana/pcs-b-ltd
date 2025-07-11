import { Router } from 'express';
import * as usersController from '../controllers/usersController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);

// Protected routes
router.get('/', authenticateToken, usersController.getAllUsers);
router.get('/:id', authenticateToken, usersController.getUserById);
router.put('/:id', authenticateToken, usersController.updateUser);
router.delete('/:id', authenticateToken, usersController.deleteUser);

export default router;
