import express from 'express';
import { updateProfilePrivacy, updatePostPrivacy } from '../Controllers/PrivacyUserController.js';
import AuthMiddleware from '../Middlewares/authMiddleware.js';
const router = express.Router();


/**
 * @swagger
 * /api/privacy/profile-privacy:
 *   put:
 *     summary: Cập nhật quyền riêng tư của hồ sơ cá nhân
 *     tags: [Privacy User Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profilePrivacy
 *             properties:
 *               profilePrivacy:
 *                 type: string
 *                 enum: [public, friend, private]
 *                 example: friend
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile privacy updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/PrivacyUser'
 *       400:
 *         description: Tuỳ chọn không hợp lệ
 *       404:
 *         description: Không tìm thấy cài đặt quyền riêng tư
 *       500:
 *         description: Lỗi máy chủ
 */

router.put('/profile-privacy', AuthMiddleware, updateProfilePrivacy);


/**
 * @swagger
 * /api/privacy/post-privacy:
 *   put:
 *     summary: Cập nhật quyền riêng tư mặc định cho bài đăng
 *     tags: [Privacy User Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postPrivacy
 *             properties:
 *               postPrivacy:
 *                 type: string
 *                 enum: [public, friend, private]
 *                 example: private
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post privacy updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/PrivacyUser'
 *       400:
 *         description: Tuỳ chọn không hợp lệ
 *       404:
 *         description: Không tìm thấy cài đặt quyền riêng tư
 *       500:
 *         description: Lỗi máy chủ
 */

router.put('/post-privacy', AuthMiddleware, updatePostPrivacy);

export default router;