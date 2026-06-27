import express from 'express';
import {
  getLessonsByChapter,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
  getAllLessons,
  getLessonSummary,
} from '../controllers/lessonController';
import { protectAdmin, protectUser } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/chapter/:chapterId', getLessonsByChapter);
router.get('/single/:id/summary', getLessonSummary);
router.get('/single/:id', getLessonById);
router.post('/', protectAdmin, createLesson);
router.put('/:id', protectAdmin, updateLesson);
router.delete('/:id', protectAdmin, deleteLesson);
router.post('/:id/complete', protectUser, completeLesson);
router.get('/all', protectUser, getAllLessons);

export default router;