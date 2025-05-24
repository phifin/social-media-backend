import express, { response } from "express";
import { uploadImage, handleImageUpload, handleVideoUpload, uploadVideo} from "../Controllers/UploadController.js";

const router = express.Router();

/**
 * @swagger
 * /api/files/upload-image:
 *   post:
 *     summary: Upload hình ảnh
 *     description: Upload một tệp hình ảnh thông qua multipart/form-data.
 *     tags: [File Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Hình ảnh đã được upload thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/upload-image', handleImageUpload, uploadImage)

/**
 * @swagger
 * /api/files/upload-video:
 *   post:
 *     summary: Upload video
 *     description: Upload một tệp video thông qua multipart/form-data.
 *     tags: [File Controller]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video đã được upload thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/upload-video', handleVideoUpload, uploadVideo)





export default router