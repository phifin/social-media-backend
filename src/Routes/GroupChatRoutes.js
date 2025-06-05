import express from 'express';
import AuthMiddleware from '../Middlewares/authMiddleware.js';
import { createGroup, getUserGroups, addMembersToGroup  } from '../Controllers/GroupChatController.js';

const router = express.Router();

/**
 * @swagger
 * /api/groupchat:
 *   post:
 *     summary: Tạo nhóm chat mới
 *     tags: [Group Chat Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - members
 *             properties:
 *               name:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tạo nhóm thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/', AuthMiddleware, createGroup);

/**
 * @swagger
 * /api/groupchat/my-groups:
 *   get:
 *     summary: Lấy danh sách các nhóm mà người dùng là thành viên
 *     tags: [Group Chat Controller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về danh sách nhóm
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/my-groups', AuthMiddleware, getUserGroups);

/**
 * @swagger
 * /api/groupchat/my-groups/{groupId}/add-members:
 *   put:
 *     summary: Thêm thành viên vào nhóm
 *     tags: [Group Chat Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newMembers
 *             properties:
 *               newMembers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Thêm thành viên thành công
 *       404:
 *         description: Không tìm thấy nhóm
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/my-groups/:groupId/add-members', AuthMiddleware, addMembersToGroup);

export default router;
