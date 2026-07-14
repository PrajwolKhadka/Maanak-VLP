import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import chapterRoutes from '../routes/chapterRoutes';
import Chapter from '../models/Chapter';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';

let app: express.Application;
let mongoServer: MongoMemoryServer;
let adminToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  process.env.JWT_SECRET = 'testsecret';

  app = express();
  app.use(express.json());
  app.use('/api/chapters', chapterRoutes);

  const admin = await Admin.create({
    email: 'admin@test.com',
    password: await bcrypt.hash('admin123', 10),
  });
  adminToken = jwt.sign({ id: admin._id }, 'testsecret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Chapter.deleteMany({});
});

describe('Chapter Controller', () => {
  it('should create a chapter as admin', async () => {
    const res = await request(app)
      .post('/api/chapters')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'First Law', topicId: 'thermodynamics', order: 1 });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('First Law');
  });

  it('should not create chapter without admin token', async () => {
    const res = await request(app).post('/api/chapters')
      .send({ name: 'First Law', topicId: 'thermodynamics' });
    expect(res.status).toBe(401);
  });

  it('should get chapters by topicId', async () => {
    await Chapter.create({ name: 'Ch1', topicId: 'thermodynamics', order: 1 });
    await Chapter.create({ name: 'Ch2', topicId: 'thermodynamics', order: 2 });
    const res = await request(app).get('/api/chapters/thermodynamics');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should return empty array for topic with no chapters', async () => {
    const res = await request(app).get('/api/chapters/nonexistent-topic');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should update a chapter as admin', async () => {
    const chapter = await Chapter.create({ name: 'Old Name', topicId: 'thermodynamics' });
    const res = await request(app)
      .put(`/api/chapters/${chapter._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'New Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('New Name');
  });

  it('should not update chapter without admin token', async () => {
    const chapter = await Chapter.create({ name: 'Test', topicId: 'thermodynamics' });
    const res = await request(app)
      .put(`/api/chapters/${chapter._id}`)
      .send({ name: 'New Name' });
    expect(res.status).toBe(401);
  });

  it('should delete a chapter as admin', async () => {
    const chapter = await Chapter.create({ name: 'To Delete', topicId: 'thermodynamics' });
    const res = await request(app)
      .delete(`/api/chapters/${chapter._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    const found = await Chapter.findById(chapter._id);
    expect(found).toBeNull();
  });

  it('should not delete chapter without admin token', async () => {
    const chapter = await Chapter.create({ name: 'Test', topicId: 'thermodynamics' });
    const res = await request(app).delete(`/api/chapters/${chapter._id}`);
    expect(res.status).toBe(401);
  });
});