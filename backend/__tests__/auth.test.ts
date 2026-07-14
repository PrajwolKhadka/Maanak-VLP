process.env.JWT_SECRET = 'testsecret';
process.env.GEMINI_API_KEY = 'test';

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import express from 'express';
import authRoutes from '../routes/authRoutes';
import User from '../models/User';
import bcrypt from 'bcryptjs';

let app: express.Application;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth Controller', () => {
  // Register
  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser', email: 'test@test.com',
      password: 'password123', contact: '9800000000', gender: 'male',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@test.com');
  });

  it('should not register with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com', password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('required');
  });

  it('should not register with short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser', email: 'test@test.com', password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('6 characters');
  });

  it('should not register with invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser', email: 'invalid-email', password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid email');
  });

  it('should not register duplicate email', async () => {
    await User.create({
      username: 'existing', email: 'test@test.com',
      password: await bcrypt.hash('password123', 10),
    });
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser', email: 'test@test.com', password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already registered');
  });

  // Login
  it('should login successfully with correct credentials', async () => {
    await User.create({
      username: 'testuser', email: 'test@test.com',
      password: await bcrypt.hash('password123', 10),
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com', password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    await User.create({
      username: 'testuser', email: 'test@test.com',
      password: await bcrypt.hash('password123', 10),
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com', password: 'wrongpassword',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should not login with non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@test.com', password: 'password123',
    });
    expect(res.status).toBe(400);
  });

  it('should not login with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('required');
  });

  // Forgot password
  it('should return 404 for forgot password with unknown email', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({
      email: 'nobody@test.com',
    });
    expect(res.status).toBe(404);
  });

  it('should return 400 for forgot password with missing email', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({});
    expect(res.status).toBe(400);
  });

  // Reset password
  it('should return 400 for invalid reset token', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      token: 'invalidtoken', password: 'newpassword123',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid or expired');
  });
});