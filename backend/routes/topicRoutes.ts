import express from 'express';
import { getTopics, getTopicById, getTopicProgress } from '../controllers/topicController';
import { protectUser } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getTopics);
router.get('/:topicId', getTopicById);
router.get('/:topicId/progress', protectUser, getTopicProgress);
export default router;