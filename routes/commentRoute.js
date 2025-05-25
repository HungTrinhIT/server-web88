import express from 'express';
import CommentController from '../controllers/commentController.js';

const router = express.Router();

router.post('/', CommentController.addComment);

export default router;
