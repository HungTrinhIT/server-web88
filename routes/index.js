import express from 'express';
import authRouter from './authRoute.js';
import commentRouter from './commentRoute.js';
import postRouter from './postRoute.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/comments', commentRouter);
router.use('/posts', postRouter);

export default router;
