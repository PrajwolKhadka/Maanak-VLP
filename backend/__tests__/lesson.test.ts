process.env.JWT_SECRET = 'testsecret';
process.env.GEMINI_API_KEY = 'test';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import lessonRoutes from '../routes/lessonRoutes';
import Lesson from '../models/Lesson';
import Chapter from '../models/Chapter';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';

let app: express.Application;
let mongoServer: MongoMemoryServer;
let adminToken: string;
let userToken: string;
let chapterId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  process.env.JWT_SECRET = 'testsecret';

  app = express();
  app.use(express.json());
  app.use('/api/lessons', lessonRoutes);

  const admin = await Admin.create({
    email: 'admin@test.com',
    password: await bcrypt.hash('admin123', 10),
  });
  adminToken = jwt.sign({ id: admin._id }, 'testsecret');

  const user = await User.create({
    username: 'testuser', email: 'user@test.com',
    password: await bcrypt.hash('password123', 10),
  });
  userToken = jwt.sign({ id: user._id }, 'testsecret');

  const chapter = await Chapter.create({ name: 'Test Chapter', topicId: 'thermodynamics' });
  chapterId = chapter._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Lesson.deleteMany({});
});

describe('Lesson Controller', () => {
  it('should create a lesson as admin', async () => {
    const res = await request(app)
      .post('/api/lessons')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'First Law', youtubeUrl: 'https://youtube.com/watch?v=test',
        chapter: chapterId, topicId: 'thermodynamics', order: 1,
      });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('First Law');
  });

  it('should not create lesson without admin token', async () => {
    const res = await request(app).post('/api/lessons')
      .send({ title: 'Test', youtubeUrl: 'https://youtube.com', chapter: chapterId, topicId: 'thermodynamics' });
    expect(res.status).toBe(401);
  });

  it('should get lessons by chapter', async () => {
    await Lesson.create({ title: 'L1', youtubeUrl: 'https://youtube.com', chapter: chapterId, topicId: 'thermodynamics', order: 1 });
    await Lesson.create({ title: 'L2', youtubeUrl: 'https://youtube.com', chapter: chapterId, topicId: 'thermodynamics', order: 2 });
    const res = await request(app).get(`/api/lessons/chapter/${chapterId}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should get single lesson by id', async () => {
    const lesson = await Lesson.create({
      title: 'Single', youtubeUrl: 'https://youtube.com',
      chapter: chapterId, topicId: 'thermodynamics',
    });
    const res = await request(app).get(`/api/lessons/single/${lesson._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Single');
  });

  it('should return 404 for non-existent lesson', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/lessons/single/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it('should update a lesson as admin', async () => {
    const lesson = await Lesson.create({
      title: 'Old', youtubeUrl: 'https://youtube.com',
      chapter: chapterId, topicId: 'thermodynamics',
    });
    const res = await request(app)
      .put(`/api/lessons/${lesson._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('should delete a lesson as admin', async () => {
    const lesson = await Lesson.create({
      title: 'Delete Me', youtubeUrl: 'https://youtube.com',
      chapter: chapterId, topicId: 'thermodynamics',
    });
    const res = await request(app)
      .delete(`/api/lessons/${lesson._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    const found = await Lesson.findById(lesson._id);
    expect(found).toBeNull();
  });

  it('should mark lesson as complete for user', async () => {
    const lesson = await Lesson.create({
      title: 'Complete Me', youtubeUrl: 'https://youtube.com',
      chapter: chapterId, topicId: 'thermodynamics',
    });
    const res = await request(app)
      .post(`/api/lessons/${lesson._id}/complete`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('complete');
  });
});