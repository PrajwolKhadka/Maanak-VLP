import express from 'express';
import passport from 'passport';
import { register, login, getMe, adminLogin, googleCallback, forgotPassword, resetPassword, updateAvatar, deleteAccount } from '../controllers/authController';
import { protectUser } from '../middleware/authMiddleware';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protectUser, getMe);
router.post('/admin/login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleCallback
);
router.put('/avatar', protectUser, upload.single('avatar'),updateAvatar);
// router.put('/account', protectUser, deleteAccount);
router.delete('/account', protectUser, deleteAccount);
export default router;