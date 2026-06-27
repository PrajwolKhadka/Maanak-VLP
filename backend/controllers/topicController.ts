import { Request, Response } from 'express';
import topics from '../constants/topics';
import Chapter from '../models/Chapter';
import Lesson from '../models/Lesson';
import UserProgress from '../models/UserProgress';

// @GET /api/topics — get all hardcoded topics
export const getTopics = (req: Request, res: Response) => {
  res.json(topics);
};

// @GET /api/topics/:topicId — get single topic with chapter count
export const getTopicById = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;

    const allTopics = topics.flatMap(t => t.subjects);
    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const chapters = await Chapter.find({ topicId }).sort({ order: 1 });

    res.json({ ...topic, chapters });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getTopicProgress = async (req: any, res: Response) => {
  try {
    const { topicId } = req.params;
    const allLessons = await Lesson.find({ topicId });
    const completed = await UserProgress.countDocuments({
      user: req.user._id,
      topicId,
      completed: true,
    });

    res.json({
      topicId,
      totalLessons: allLessons.length,
      completedLessons: completed,
      percentage: allLessons.length
        ? Math.round((completed / allLessons.length) * 100)
        : 0,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};