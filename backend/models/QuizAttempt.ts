import mongoose from 'mongoose';

const questionResultSchema = new mongoose.Schema({
  question: String,
  options: [String],
  userAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  explanation: String,
});

const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  topicId: { type: String },
  questions: [questionResultSchema],
  score: { type: Number },
  totalQuestions: { type: Number },
  aiInsights: { type: Object }, // Gemini generated insights
  timeTaken: { type: Number }, // seconds
}, { timestamps: true });

export default mongoose.model('QuizAttempt', quizAttemptSchema);