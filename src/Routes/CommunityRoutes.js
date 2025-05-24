import express from 'express';
import AuthMiddleware from '../Middlewares/authMiddleware.js';
import {
  createCommunity,
  joinCommunity,
  getMyCommunities,
  leaveCommunity,
  addModerator,
  inviteUserToCommunity,
  updateCommunityInfo,
  approveJoinRequest,
  rejectJoinRequest,
  deleteCommunity,
  createPostInCommunity,
  approveCommunityPost,
  getCommunityPosts,
  getPendingCommunityPosts,
  updateCommunityPost,
  getCommunityPostById

} from '../Controllers/CommunityController.js';

const router = express.Router();

/**
 * @swagger
 * /api/community:
 *   post:
 *     summary: Tạo cộng đồng mới
 *     tags: [Community]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               avatar:
 *                 type: string
 *               banner:
 *                 type: string
 *               privacy:
 *                 type: string
 *                 enum: [public, private]
 *     responses:
 *       201:
 *         description: Cộng đồng được tạo thành công
 */
router.post('/', AuthMiddleware, createCommunity);

/**
 * @swagger
 * /api/community/{communityId}/join:
 *   put:
 *     summary: Tham gia cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tham gia thành công
 */
router.put('/:communityId/join', AuthMiddleware, joinCommunity);

/**
 * @swagger
 * /api/community/{communityId}/leave:
 *   put:
 *     summary: Rời cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rời cộng đồng thành công
 */
router.put('/:communityId/leave', AuthMiddleware, leaveCommunity);

/**
 * @swagger
 * /api/community/{communityId}/invite:
 *   put:
 *     summary: Mời người dùng vào cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
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
 *               - userIdToInvite
 *             properties:
 *               userIdToInvite:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mời thành công
 */
router.put('/:communityId/invite', AuthMiddleware, inviteUserToCommunity);

/**
 * @swagger
 * /api/community/{communityId}/add-moderator:
 *   put:
 *     summary: Thêm quản trị viên cho cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
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
 *               - userIdToPromote
 *             properties:
 *               userIdToPromote:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã thêm quản trị viên
 *       400:
 *         description: Chỉ người tạo mới có quyền thêm
 */
router.put('/:communityId/add-moderator', AuthMiddleware, addModerator);

/**
 * @swagger
 * /api/community/my:
 *   get:
 *     summary: Lấy danh sách cộng đồng của tôi
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/my', AuthMiddleware, getMyCommunities);

/**
 * @swagger
 * /api/community/{communityId}/update:
 *   put:
 *     summary: Cập nhật thông tin cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cộng đồng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *               banner:
 *                 type: string
 *             example:
 *               name: Cộng đồng công nghệ
 *               avatar: https://example.com/avatar.png
 *               banner: https://example.com/banner.jpg
 *     responses:
 *       200:
 *         description: Cập nhật thông tin cộng đồng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Community'
 *       403:
 *         description: Chỉ người tạo mới có quyền chỉnh sửa
 *       404:
 *         description: Không tìm thấy cộng đồng
 */

router.put('/:communityId/update', AuthMiddleware, updateCommunityInfo);

/**
 * @swagger
 * /api/community/{communityId}/approve:
 *   put:
 *     summary: Duyệt yêu cầu tham gia cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cộng đồng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIdToApprove
 *             properties:
 *               userIdToApprove:
 *                 type: string
 *                 description: ID của người dùng muốn duyệt
 *     responses:
 *       200:
 *         description: Người dùng đã được thêm vào cộng đồng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 community:
 *                   $ref: '#/components/schemas/Community'
 *       403:
 *         description: Không có quyền duyệt yêu cầu
 *       404:
 *         description: Không tìm thấy cộng đồng
 */

router.put('/:communityId/approve', AuthMiddleware, approveJoinRequest);

/**
 * @swagger
 * /api/community/{communityId}/reject:
 *   put:
 *     summary: Từ chối yêu cầu tham gia cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cộng đồng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIdToReject
 *             properties:
 *               userIdToReject:
 *                 type: string
 *                 description: ID của người dùng bị từ chối
 *     responses:
 *       200:
 *         description: Yêu cầu tham gia đã bị từ chối
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Không có quyền từ chối yêu cầu
 *       404:
 *         description: Không tìm thấy cộng đồng
 */

router.put('/:communityId/reject', AuthMiddleware, rejectJoinRequest);


/**
 * @swagger
 * /api/community/{communityId}/posts:
 *   post:
 *     summary: Gửi bài viết vào cộng đồng (sẽ chờ duyệt)
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cộng đồng
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
 *               image:
 *                 type: string
 *                 description: URL hình ảnh (nếu có)
 *     responses:
 *       201:
 *         description: Bài viết đã được gửi, chờ duyệt
 *       403:
 *         description: Bạn không phải thành viên của cộng đồng này
 */
router.post('/:communityId/posts', AuthMiddleware, createPostInCommunity);


/**
 * @swagger
 * /api/community/{communityId}/posts:
 *   get:
 *     summary: Lấy danh sách bài viết đã được duyệt trong cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết đã được duyệt
 */
router.get('/:communityId/posts', AuthMiddleware, getCommunityPosts);

/**
 * @swagger
 * /api/community/{communityId}/posts/pending:
 *   get:
 *     summary: Lấy danh sách bài viết đang chờ duyệt
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bài viết chờ duyệt
 *       403:
 *         description: Bạn không có quyền xem danh sách bài viết chờ duyệt
 */
router.get('/:communityId/posts/pending', AuthMiddleware, getPendingCommunityPosts); // optional


/**
 * @swagger
 * /api/community/posts/{postId}/approve:
 *   patch:
 *     summary: Duyệt bài viết trong cộng đồng
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần duyệt
 *     responses:
 *       200:
 *         description: Bài viết đã được duyệt thành công
 *       403:
 *         description: Bạn không có quyền duyệt bài viết này
 *       404:
 *         description: Không tìm thấy bài viết
 */
router.patch('/posts/:postId/approve', AuthMiddleware, approveCommunityPost);




export default router;
