import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  topicId: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Chapter', chapterSchema);