import express from 'express';
import {
  getChaptersByTopic,
  createChapter,
  updateChapter,
  deleteChapter,
} from '../controllers/chapterController';
import { protectAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/:topicId', getChaptersByTopic);
router.post('/', protectAdmin, createChapter);
router.put('/:id', protectAdmin, updateChapter);
router.delete('/:id', protectAdmin, deleteChapter);

export default router;