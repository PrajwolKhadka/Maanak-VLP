import { Request, Response } from 'express';
import UserProgress from '../models/UserProgress';
import QuizAttempt from '../models/QuizAttempt';
import Lesson from '../models/Lesson';
import Chapter from '../models/Chapter';
import topics from '../constants/topics';

export const getDashboard = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;

    // total quizzes taken
    const totalQuizzes = await QuizAttempt.countDocuments({ user: userId });

    // topics finished (all lessons in a topic completed)
    const completedProgress = await UserProgress.find({ user: userId, completed: true });
    const completedLessonIds = completedProgress.map(p => p.lesson.toString());

    // average score
    const attempts = await QuizAttempt.find({ user: userId });
    const avgScore = attempts.length
      ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length)
      : 0;

    // accuracy (correct answers / total questions across all attempts)
    const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0);
    const totalQs = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const accuracy = totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0;

    // topics finished count — topic where all lessons are completed
    const allTopicIds = topics.flatMap(t => t.subjects).map(s => s.id);
    let topicsFinished = 0;
    for (const topicId of allTopicIds) {
      const allLessons = await Lesson.find({ topicId });
      if (allLessons.length === 0) continue;
      const allDone = allLessons.every(l => completedLessonIds.includes(l._id.toString()));
      if (allDone) topicsFinished++;
    }

    // continue where left off — last 2 in-progress lessons
    const inProgress = await UserProgress.find({ user: userId })
      .sort({ updatedAt: -1 })
      .limit(2)
      .populate('lesson')
      .populate('chapter');

    const continueItems = await Promise.all(
      inProgress.map(async (p: any) => {
        const totalLessons = await Lesson.countDocuments({ chapter: p.chapter._id });
        const completedLessons = await UserProgress.countDocuments({
          user: userId,
          chapter: p.chapter._id,
          completed: true,
        });
        return {
          topicId: p.topicId,
          chapterId: p.chapter._id,
          chapterName: p.chapter.name,
          lessonId: p.lesson._id,
          lessonTitle: p.lesson.title,
          completedLessons,
          totalLessons,
          percentage: Math.round((completedLessons / totalLessons) * 100),
        };
      })
    );

    // explore topics — first 4 from constants
    const exploreTopics = topics.flatMap(t => t.subjects).slice(0, 4);

    // streak from user model
    const streak = req.user.streak || 0;

    res.json({
      stats: { totalQuizzes, topicsFinished, avgScore, accuracy },
      continueItems,
      exploreTopics,
      streak,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};