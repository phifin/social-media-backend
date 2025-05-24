import express from 'express';
import {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleSavePost
} from '../Controllers/PostController.js';
import AuthMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Public

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [Post Controller]
 *     responses:
 *       200:
 *         description: Danh sách bài viết
 */
router.get('/', getAllPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Lấy chi tiết bài viết theo ID
 *     tags: [Post Controller]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết bài viết
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.get('/:id', getPostById);

// Protected

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Post Controller]
 *     security:
 *       - bearerAuth: []
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
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               video:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               taggedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *               privacy:
 *                 type: string
 *                 enum: [public, friends, private]
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', AuthMiddleware, createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     tags: [Post Controller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               video:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.put('/:id', AuthMiddleware, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Xoá bài viết
 *     tags: [Post Controller]
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
 *         description: Không tìm thấy bài viết
 */
router.delete('/:id', AuthMiddleware, deletePost);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Like/Unlike bài viết
 *     tags: [Post Controller]
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
 *         description: Like hoặc Unlike thành công
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.post('/:id/like', AuthMiddleware, toggleLikePost);


/**
 * @swagger
 * /api/posts/{id}/save:
 *   post:
 *     summary: Save/Unsave bài viết
 *     tags: [Post Controller]
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
 *         description: Save hoặc Unsave thành công
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.post('/:id/save', AuthMiddleware, toggleSavePost);

export default router;
