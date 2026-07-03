import { Request, Response } from 'express';
import Lesson from '../models/Lesson';
import QuizAttempt from '../models/QuizAttempt';
import { generateQuizQuestions, generateQuizInsights } from '../services/geminiService';

// @GET /api/quiz/generate/:lessonId — generate questions from lesson transcript
export const generateQuiz = async (req: Request, res: Response) => {
  try {
    console.log("Generating quiz")
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    if (!lesson.transcript) return res.status(400).json({ message: 'Lesson has no transcript' });

    const questions = await generateQuizQuestions(lesson.transcript, lesson.title);

    // return questions without correct answers to frontend
    const sanitized = questions.map(({ question, options }) => ({ question, options }));

    // store full questions temporarily — frontend sends answers back with these questions
    res.json({ lessonId: lesson._id, questions: sanitized, _raw: questions });
  } catch (err: any) {
    console.log("Quizfailed")
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/quiz/submit/:lessonId — submit answers, get score + AI insights
export const submitQuiz = async (req: any, res: Response) => {
  try {
    const { answers, rawQuestions, timeTaken } = req.body;
    // answers: [{ question, userAnswer }]
    // rawQuestions: the _raw array sent back from generate

    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    // grade answers
    const graded = rawQuestions.map((q: any, i: number) => ({
      question: q.question,
      options: q.options,
      userAnswer: answers[i]?.userAnswer || 'Skipped',
      correctAnswer: q.correctAnswer,
      isCorrect: answers[i]?.userAnswer === q.correctAnswer,
      explanation: q.explanation,
    }));

    const score = graded.filter((q: any) => q.isCorrect).length;

    // generate AI insights
    const aiInsights = await generateQuizInsights(lesson.title, graded);

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      lesson: lesson._id,
      topicId: lesson.topicId,
      questions: graded,
      score,
      totalQuestions: graded.length,
      aiInsights,
      timeTaken,
    });

    res.json({
      score,
      totalQuestions: graded.length,
      percentage: Math.round((score / graded.length) * 100),
      questions: graded,
      aiInsights,
      attemptId: attempt._id,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/quiz/attempts/:lessonId — get user's past attempts for a lesson
export const getAttempts = async (req: any, res: Response) => {
  try {
    const attempts = await QuizAttempt.find({
      user: req.user._id,
      lesson: req.params.lessonId,
    }).sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/quiz/attempt/:attemptId — get single attempt result
export const getAttemptById = async (req: any, res: Response) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.attemptId).populate('lesson');
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });
    res.json(attempt);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuizHistory = async (req: any, res: Response) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user._id })
      .populate('lesson', 'title topicId')
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};