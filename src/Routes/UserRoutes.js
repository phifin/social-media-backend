import express from 'express';
import UserController from '../Controllers/UserController.js';
import AuthMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', AuthMiddleware, UserController.getCurrentUser);
router.put('/me', AuthMiddleware, UserController.updateProfile);
router.put('/me/change-password', AuthMiddleware, UserController.changePassword);
router.delete('/me', AuthMiddleware, UserController.deleteAccount);

router.get('/search', AuthMiddleware, UserController.searchUsers);

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

router.post('/:targetUserId/follow', AuthMiddleware, UserController.followOrUnfollowUser)


router.get('/me/followers', AuthMiddleware, UserController.getMyFollowers);
router.get('/me/following', AuthMiddleware, UserController.getMyFollowing);


export default router;
