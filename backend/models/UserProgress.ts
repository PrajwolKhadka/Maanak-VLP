import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  topicId: { type: String, required: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('UserProgress', userProgressSchema);