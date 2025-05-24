import { Router } from "express";
const router = Router();
import { getMessages, sendMessage } from "../Controllers/ChatController.js";
import AuthMiddleware from "../Middlewares/authMiddleware.js";


/**
 * @swagger
 * /api/chat/history/{partnerId}:
 *   get:
 *     summary: Lấy lịch sử tin nhắn giữa người dùng hiện tại và partner
 *     tags: [Chat Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: partnerId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người nhận hoặc đối tác trò chuyện
 *     responses:
 *       200:
 *         description: Trả về danh sách tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   from:
 *                     type: string
 *                   to:
 *                     type: string
 *                   content:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [text, image]
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 */
router.get("/history/:partnerId", AuthMiddleware, getMessages);


/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Gửi tin nhắn đến người khác
 *     tags: [Chat Controller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - content
 *             properties:
 *               to:
 *                 type: string
 *                 description: ID của người nhận
 *               content:
 *                 type: string
 *                 description: Nội dung tin nhắn hoặc URL ảnh
 *               type:
 *                 type: string
 *                 enum: [text, image]
 *                 default: text
 *     responses:
 *       200:
 *         description: Tin nhắn đã được gửi thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *                 content:
 *                   type: string
 *                 type:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 */
router.post("/send", AuthMiddleware, sendMessage);

export default router;
