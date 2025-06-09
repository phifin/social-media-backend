import express from 'express';
import UserController from '../Controllers/UserController.js';
import AuthMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại   
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 */

router.get('/me', AuthMiddleware, UserController.getCurrentUser);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Cập nhật thông tin hồ sơ người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *               coverPhoto:
 *                 type: string
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/me', AuthMiddleware, UserController.updateProfile);


/**
 * @swagger
 * /api/users/me/change-password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */
router.put('/me/change-password', AuthMiddleware, UserController.changePassword);


/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Xóa tài khoản
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa tài khoản thành công
 */
router.delete('/me', AuthMiddleware, UserController.deleteAccount);


/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Tìm kiếm người dùng theo username
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên người dùng cần tìm
 *     responses:
 *       200:
 *         description: Danh sách người dùng tìm được
 */
router.get('/search', AuthMiddleware, UserController.searchUsers);


/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 */
router.get('/', UserController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết người dùng
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user with privacy info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     coverPhoto:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 privacy:
 *                   type: object
 *                   properties:
 *                     profilePrivacy:
 *                       type: string
 *                       enum: [public, friend, private]
 *                     postPrivacy:
 *                       type: string
 *                       enum: [public, friend, private]
 *                     friends:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserSummary'
 *                     following:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserSummary'
 *                     followers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserSummary'
 *                     blocked:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserSummary'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/:id', UserController.getUserById);


/**
 * @swagger
 * /api/users/{targetUserId}/follow:
 *   post:
 *     summary: Theo dõi hoặc hủy theo dõi người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID người dùng cần theo dõi
 *     responses:
 *       200:
 *         description: Theo dõi/hủy theo dõi thành công
 */
router.post('/:targetUserId/follow', AuthMiddleware, UserController.followOrUnfollowUser)

/**
 * @swagger
 * /api/users/me/followers:
 *   get:
 *     summary: Lấy danh sách người theo dõi bạn
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách follower
 */

router.get('/me/followers', AuthMiddleware, UserController.getMyFollowers);

/**
 * @swagger
 * /api/users/me/following:
 *   get:
 *     summary: Lấy danh sách bạn đang theo dõi
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách following
 */
router.get('/me/following', AuthMiddleware, UserController.getMyFollowing);


export default router;
