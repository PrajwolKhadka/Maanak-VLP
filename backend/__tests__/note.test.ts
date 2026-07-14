import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import noteRoutes from '../routes/noteRoutes';
import Note from '../models/Note';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

let app: express.Application;
let mongoServer: MongoMemoryServer;
let userToken: string;
let userId: string;
const lessonId = new mongoose.Types.ObjectId().toString();

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  process.env.JWT_SECRET = 'testsecret';

  app = express();
  app.use(express.json());
  app.use('/api/notes', noteRoutes);

  const user = await User.create({
    username: 'noteuser', email: 'note@test.com',
    password: await bcrypt.hash('password123', 10),
  });
  userId = user._id.toString();
  userToken = jwt.sign({ id: user._id }, 'testsecret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Note.deleteMany({});
});

describe('Note Controller', () => {
  it('should create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ lessonId, content: 'Test note', type: 'personal' });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Test note');
  });

  it('should get notes by lesson', async () => {
    await Note.create({ user: userId, lesson: lessonId, content: 'Note 1', type: 'personal' });
    await Note.create({ user: userId, lesson: lessonId, content: 'Note 2', type: 'personal' });
    const res = await request(app)
      .get(`/api/notes/${lessonId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should not get notes without auth', async () => {
    const res = await request(app).get(`/api/notes/${lessonId}`);
    expect(res.status).toBe(401);
  });

  it('should update a note', async () => {
    const note = await Note.create({ user: userId, lesson: lessonId, content: 'Old', type: 'personal' });
    const res = await request(app)
      .put(`/api/notes/${note._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: 'Updated note' });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Updated note');
  });

  it('should delete a note', async () => {
    const note = await Note.create({ user: userId, lesson: lessonId, content: 'Delete me', type: 'personal' });
    const res = await request(app)
      .delete(`/api/notes/${note._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    const found = await Note.findById(note._id);
    expect(found).toBeNull();
  });

  it('should not delete another user note', async () => {
    const otherUser = await User.create({
      username: 'other', email: 'other@test.com',
      password: await bcrypt.hash('password123', 10),
    });
    const note = await Note.create({ user: otherUser._id, lesson: lessonId, content: 'Other note', type: 'personal' });
    const res = await request(app)
      .delete(`/api/notes/${note._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(404);
  });

  it('should create note with different types', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ lessonId, content: 'Class note', type: 'class' });
    expect(res.status).toBe(201);
    expect(res.body.type).toBe('class');
  });
});