import express, { response } from "express";
import { uploadImage, handleImageUpload, handleVideoUpload, uploadVideo} from "../Controllers/UploadController.js";

const router = express.Router();

router.post('/upload-image', handleImageUpload, uploadImage)
router.post('/upload-video', handleVideoUpload, uploadVideo)





export default router