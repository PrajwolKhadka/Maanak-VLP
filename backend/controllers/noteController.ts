import { Request, Response } from 'express';
import Note from '../models/Note';

// // @GET /api/notes/:lessonId — get notes for a lesson
export const getNotesByLesson = async (req: any, res: Response) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
      lesson: req.params.lessonId,
    }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// @GET /api/notes/topic/:topicId
export const getNotesByTopic = async (req: any, res: Response) => {
  try {
    // Log what we're querying with
    console.log('Querying notes for:', {
      user: req.user._id,
      topicId: req.params.topicId,
    });

    const all = await Note.find({});
    console.log('ALL notes in DB:', JSON.stringify(all, null, 2));

    const notes = await Note.find({
      user: req.user._id,
      topicId: req.params.topicId,
    }).sort({ createdAt: -1 });

    console.log('Matched notes:', notes);
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// @POST /api/notes — create note
export const createNote = async (req: any, res: Response) => {
  try {
    const { lessonId, topicId, content, type } = req.body;
    const note = await Note.create({
      user: req.user._id,
      lesson: lessonId,
      topicId,
      content,
      type: type || 'personal',
    });
    res.status(201).json(note);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/notes/:id — update note
export const updateNote = async (req: any, res: Response) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.content = req.body.content ?? note.content;
    note.type = req.body.type ?? note.type;
    await note.save();

    res.json(note);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/notes/:id — delete note
export const deleteNote = async (req: any, res: Response) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Note deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};