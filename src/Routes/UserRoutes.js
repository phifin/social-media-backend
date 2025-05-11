import express from 'express';
import UserController from '../Controllers/UserController.js';
import AuthMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', AuthMiddleware, UserController.getCurrentUser);
router.put('/me', AuthMiddleware, UserController.updateProfile);
router.put('/me/change-password', AuthMiddleware, UserController.changePassword);
router.delete('/me', AuthMiddleware, UserController.deleteAccount);

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

export default router;
