import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin';
import dotenv from 'dotenv';
dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const existing = await Admin.findOne({ email: 'admin@maanak.com' });
  if (existing) {
    console.log('Admin already exists');
    process.exit();
  }

  const hashed = await bcrypt.hash('admin123', 10);
  await Admin.create({ email: 'admin@maanak.com', password: hashed });
  console.log('Admin created: admin@maanak.com / admin123');
  process.exit();
};

seed();