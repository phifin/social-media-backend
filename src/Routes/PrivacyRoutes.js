import express from 'express';
import { updateProfilePrivacy, updatePostPrivacy } from '../Controllers/PrivacyUserController.js';
import AuthMiddleware from '../Middlewares/authMiddleware.js';
const router = express.Router();

router.put('/profile-privacy', AuthMiddleware, updateProfilePrivacy);

router.put('/post-privacy', AuthMiddleware, updatePostPrivacy);

export default router;