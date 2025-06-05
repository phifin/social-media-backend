import express from 'express';
import AuthMiddleware from '../Middlewares/authMiddleware.js';
import { getGroupMessages } from '../Controllers/GroupChatMessageController.js';

const router = express.Router();

/**
 * @swagger
 * /api/groupchatmessage/{groupId}:
 *   get:
 *     summary: Lấy danh sách tin nhắn trong nhóm
 *     tags: [Group Chat Message Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID nhóm cần lấy tin nhắn
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách tin nhắn
 *       401:
 *         description: Không được xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:groupId', AuthMiddleware, getGroupMessages);

export default router;
