import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import gameRoutes from './game.routes';
import leaderboardRoutes from './leaderboard.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/game', gameRoutes);
router.use('/leaderboard', leaderboardRoutes);

export default router;