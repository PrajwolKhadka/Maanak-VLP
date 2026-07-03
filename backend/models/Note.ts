import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  topicId: { type: String },
  content: { type: String, required: true },
  type: { type: String, enum: ['personal', 'class', 'review'], default: 'personal' },
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);