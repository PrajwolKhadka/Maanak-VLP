import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Admin from '../models/Admin';

const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

// @POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, contact, gender } = req.body;

    // validation
    if (!username || !email || !password)
      return res.status(400).json({ message: 'Username, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: 'Invalid email format' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed, contact, gender });

    res.status(201).json({
      token: generateToken(user._id.toString()),
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.password) return res.status(400).json({ message: 'Please login with Google' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id.toString()),
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// // @GET /api/auth/me
// export const getMe = async (req: any, res: Response) => {
//   res.json(req.user);
// };
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date().toDateString();
    const last = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (last !== today) {
      user.streak = last === yesterday ? (user.streak || 0) + 1 : 1;
      user.lastActiveDate = new Date();
      await user.save();
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      streak: user.streak,
      contact: user.contact,
      gender: user.gender,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// @POST /api/auth/admin/login
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(admin._id.toString()),
      admin: { id: admin._id, email: admin.email },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/google/callback — handled by passport, just send token
export const googleCallback = async (req: any, res: Response) => {
  try {
    const token = generateToken(req.user._id.toString());
    // redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}`);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

