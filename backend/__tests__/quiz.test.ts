process.env.JWT_SECRET = 'testsecret';
process.env.GEMINI_API_KEY = 'test';

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import quizRoutes from '../routes/quizRoutes';
import QuizAttempt from '../models/QuizAttempt';
import User from '../models/User';
import Lesson from '../models/Lesson';
import Chapter from '../models/Chapter';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

let app: express.Application;
let mongoServer: MongoMemoryServer;
let userToken: string;
let userId: string;
let lessonId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(express.json());
  app.use('/api/quiz', quizRoutes);

  const user = await User.create({
    username: 'quizuser', email: 'quiz@test.com',
    password: await bcrypt.hash('password123', 10),
  });
  userId = user._id.toString();
  userToken = jwt.sign({ id: user._id }, 'testsecret');

  const chapter = await Chapter.create({ name: 'Test Chapter', topicId: 'thermodynamics' });
  const lesson = await Lesson.create({
    title: 'Test Lesson',
    youtubeUrl: 'https://youtube.com/watch?v=test',
    transcript: 'Test transcript content',
    chapter: chapter._id,
    topicId: 'thermodynamics',
  });
  lessonId = lesson._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Quiz Controller', () => {
  it('should not generate quiz without auth', async () => {
    const res = await request(app).get(`/api/quiz/generate/${lessonId}`);
    expect(res.status).toBe(401);
  });

  it('should get empty attempts for new lesson', async () => {
    const res = await request(app)
      .get(`/api/quiz/attempts/${lessonId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should not submit quiz without auth', async () => {
    const res = await request(app)
      .post(`/api/quiz/submit/${lessonId}`)
      .send({ answers: [], rawQuestions: [], timeTaken: 60 });
    expect(res.status).toBe(401);
  });

  it('should return 404 for attempt with invalid id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/quiz/attempt/${fakeId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });

  it('should get quiz history', async () => {
    const res = await request(app)
      .get('/api/quiz/history')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});