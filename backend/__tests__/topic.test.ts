process.env.JWT_SECRET = 'testsecret';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import topicRoutes from '../routes/topicRoutes';

let app: express.Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = express();
  app.use(express.json());
  app.use('/api/topics', topicRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Topic Controller', () => {
  it('should return all topics', async () => {
    const res = await request(app).get('/api/topics');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return topics with category and subjects', async () => {
    const res = await request(app).get('/api/topics');
    expect(res.body[0]).toHaveProperty('category');
    expect(res.body[0]).toHaveProperty('subjects');
  });

  it('should have Physical Chemistry category', async () => {
    const res = await request(app).get('/api/topics');
    const categories = res.body.map((c: any) => c.category);
    expect(categories).toContain('Physical Chemistry');
  });

  it('should have Organic Chemistry category', async () => {
    const res = await request(app).get('/api/topics');
    const categories = res.body.map((c: any) => c.category);
    expect(categories).toContain('Organic Chemistry');
  });

  it('should return 404 for non-existent topic', async () => {
    const res = await request(app).get('/api/topics/non-existent-topic-xyz');
    expect(res.status).toBe(404);
  });
});