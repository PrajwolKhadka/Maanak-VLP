import express from 'express';
import {
  generateQuiz,
  submitQuiz,
  getAttempts,
  getAttemptById,
  getQuizHistory,
} from '../controllers/quizController';
import { protectUser } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/generate/:lessonId', protectUser, generateQuiz);
router.post('/submit/:lessonId', protectUser, submitQuiz);
router.get('/attempts/:lessonId', protectUser, getAttempts);
router.get('/attempt/:attemptId', protectUser, getAttemptById);
router.get('/history', protectUser, getQuizHistory);
export default router;