import { Router } from 'express';
import { postController } from '../controllers/postController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', (req, res) => postController.getPosts(req, res));
router.get('/:id', (req, res) => postController.getPostById(req, res));
router.post('/', authenticateToken, (req, res) =>
	postController.createPost(req, res)
);
router.put('/:id', authenticateToken, (req, res) =>
	postController.updatePost(req, res)
);
router.delete('/:id', authenticateToken, (req, res) =>
	postController.deletePost(req, res)
);

export { router as postRoutes };
