import express from 'express';
import {
  createNote,
  updateNote,
  deleteNote,
  getNotesByTopic,
  getNotesByLesson,
} from '../controllers/noteController';
import { protectUser } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/topic/:topicId', protectUser, getNotesByTopic);
router.get('/:lessonId', protectUser, getNotesByLesson);
router.post('/', protectUser, createNote);
router.put('/:id', protectUser, updateNote);
router.delete('/:id', protectUser, deleteNote);

export default router;