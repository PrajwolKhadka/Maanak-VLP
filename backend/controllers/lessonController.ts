import { Request, Response } from 'express';
import Lesson from '../models/Lesson';
import UserProgress from '../models/UserProgress';
import { generateLessonSummary } from '../services/geminiService';
// @GET /api/lessons/:chapterId — get lessons under a chapter
export const getLessonsByChapter = async (req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find({ chapter: req.params.chapterId }).sort({ order: 1 });
    res.json(lessons);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/lessons/single/:id — get single lesson
export const getLessonById = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('chapter');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/lessons — admin creates lesson
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, youtubeUrl, transcript, chapter, topicId, order, duration } = req.body;
    const lesson = await Lesson.create({ title, youtubeUrl, transcript, chapter, topicId, order, duration });
    res.status(201).json(lesson);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/lessons/:id — admin updates lesson
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/lessons/:id — admin deletes lesson
export const deleteLesson = async (req: Request, res: Response) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lesson deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/lessons/:id/complete — user marks lesson complete
export const completeLesson = async (req: any, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const existing = await UserProgress.findOne({ user: req.user._id, lesson: lesson._id });
    if (existing) return res.json({ message: 'Already completed' });

    await UserProgress.create({
      user: req.user._id,
      lesson: lesson._id,
      topicId: lesson.topicId,
      chapter: lesson.chapter,
      completed: true,
      completedAt: new Date(),
    });

    res.json({ message: 'Lesson marked complete' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllLessons = async (req: Request, res: Response) => {
  try{
    const lessons = await Lesson.find().populate('chapter','name').sort({createdAt: -1});
    res.json(lessons);
  }catch(err:any){
    res.status(500).json({message: err.message});
  }
}

export const getLessonSummary = async (req: Request, res: Response) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    if (!lesson.transcript) return res.status(400).json({ message: 'No transcript' });

    try {
      console.log("Generating Summary");
      const summary = await generateLessonSummary(lesson.transcript, lesson.title);
      console.log("Generating Summary");
      return res.json({ ...summary, isAI: true });
    } catch {
      console.log("API Failed")
      return res.json({
        summary: lesson.transcript,
        keyPoints: [],
        isAI: false,
      });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};