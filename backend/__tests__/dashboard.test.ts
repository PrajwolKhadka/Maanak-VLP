process.env.JWT_SECRET = 'testsecret';

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import dashboardRoutes from '../routes/dashboardRoutes';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

let app: express.Application;
let mongoServer: MongoMemoryServer;
let userToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  app = express();
  app.use(express.json());
  app.use('/api/dashboard', dashboardRoutes);

  const user = await User.create({
    username: 'dashuser', email: 'dash@test.com',
    password: await bcrypt.hash('password123', 10),
  });
  userToken = jwt.sign({ id: user._id }, 'testsecret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Dashboard Controller', () => {
  it('should not access dashboard without auth', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.status).toBe(401);
  });

  it('should return dashboard data for authenticated user', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });

  it('should return stats object', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.body).toHaveProperty('stats');
  });

  it('should return continueItems array', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.body).toHaveProperty('continueItems');
    expect(Array.isArray(res.body.continueItems)).toBe(true);
  });

  it('should return exploreTopics array', async () => {
    const res = await request(app)
      .get('/api/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.body).toHaveProperty('exploreTopics');
    expect(Array.isArray(res.body.exploreTopics)).toBe(true);
  });
});