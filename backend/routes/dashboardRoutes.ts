import express from 'express';
import { getDashboard } from '../controllers/dashboardController';
import { protectUser } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protectUser, getDashboard);

export default router;