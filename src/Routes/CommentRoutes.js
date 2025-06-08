import express from 'express';
import {
  createComment,
  toggleLikeComment,
  deleteComment
} from '../Controllers/CommentController.js';
import AuthMiddleware from '../Middlewares/authMiddleware.js';



const router = express.Router();

// Protected

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Tạo bình luận cho bài viết
 *     tags: [Comment Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               parentComment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bình luận thành công
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.post('/:postId', AuthMiddleware, createComment);

/**
 * @swagger
 * /api/comments/{id}/like:
 *   post:
 *     summary: Like/Unlike bình luận
 *     tags: [Comment Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like hoặc Unlike bình luận thành công
 *       404:
 *         description: Không tìm thấy bình luận
 */
router.post('/:id/like', AuthMiddleware, toggleLikeComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Xoá bình luận
 *     tags: [Comment Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
 *       404:
 *         description: Không tìm thấy bình luận
 */
router.delete('/:id', AuthMiddleware, deleteComment);

export default router;
