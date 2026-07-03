import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // null if Google OAuth
  googleId: { type: String },
  contact: { type: String },
  gender: { type: String },
  avatar: { type: String },
  streak: { type: Number, default: 0 },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  lastActiveDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('User', userSchema);