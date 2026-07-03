import express from 'express';
import passport from 'passport';
import { register, login, getMe, adminLogin, googleCallback } from '../controllers/authController';
import { protectUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protectUser, getMe);
router.post('/admin/login', adminLogin);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);

export default router;