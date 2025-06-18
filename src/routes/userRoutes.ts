import { Router } from 'express';
import { userController } from '../controllers/usercontroller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, (req, res) =>
	userController.getUsers(req, res)
);
router.get('/:id', authenticateToken, (req, res) =>
	userController.getUserById(req, res)
);

export { router as userRoutes };
