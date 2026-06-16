import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtubeUrl: { type: String, required: true },
  transcript: { type: String },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  topicId: { type: String, required: true },
  order: { type: Number, default: 0 },
  duration: { type: String },
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);