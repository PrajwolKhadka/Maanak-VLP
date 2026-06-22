import { Request, Response } from 'express';
import Chapter from '../models/Chapter';
import Lesson from '../models/Lesson';

// @GET /api/chapters/:topicId — get chapters under a topic
export const getChaptersByTopic = async (req: Request, res: Response) => {
  try {
    const chapters = await Chapter.find({ topicId: req.params.topicId }).sort({ order: 1 });
    res.json(chapters);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/chapters — admin creates chapter
export const createChapter = async (req: Request, res: Response) => {
  try {
    const { name, description, topicId, order } = req.body;
    const chapter = await Chapter.create({ name, description, topicId, order });
    res.status(201).json(chapter);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/chapters/:id — admin updates chapter
export const updateChapter = async (req: Request, res: Response) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' });
    res.json(chapter);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/chapters/:id — admin deletes chapter
export const deleteChapter = async (req: Request, res: Response) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    await Lesson.deleteMany({ chapter: req.params.id });
    res.json({ message: 'Chapter deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};