import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Admin from "../models/Admin";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";

const generateToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

// @POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, contact, gender } = req.body;

    // validation
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ message: "Username, email and password are required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashed,
      contact,
      gender,
    });

    res.status(201).json({
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.password)
      return res.status(400).json({ message: "Please login with Google" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
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
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date().toDateString();
    const last = user.lastActiveDate
      ? new Date(user.lastActiveDate).toDateString()
      : null;
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
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

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
    res.redirect(
      `${process.env.CLIENT_URL}/auth/google/success?token=${token}`,
    );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account with that email" });
    if (!user.password)
      return res
        .status(400)
        .json({ message: "This account uses Google login" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail(
      email,
      "Reset your Maanak password",
      `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
        <h2>Reset your password</h2>
        <p>You requested a password reset for your Maanak account.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">
          Reset Password
        </a>
        <p style="color:#888;font-size:12px;margin-top:16px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
    );

    res.json({ message: "Password reset email sent" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Token and password required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired reset link" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    await User.findByIdAndUpdate(user._id, {
      password: await bcrypt.hash(password, 10),
      $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 },
    });

    res.json({ message: "Password reset successful" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/auth/avatar
export const updateAvatar = async (req: any, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const avatarUrl = `http://localhost:5001/uploads/${file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({ avatar: user?.avatar, user });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// @DELETE /api/auth/account
export const deleteAccount = async (req: any, res: Response) => {
  try {
    const { reason } = req.body;
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted', reason });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
