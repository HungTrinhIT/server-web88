import express from 'express';
import PostController from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, PostController.getAll);
router.post('/', protect, PostController.add);

export default router;
