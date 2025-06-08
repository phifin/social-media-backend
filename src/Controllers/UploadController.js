import cloudinary from 'cloudinary'
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import image from '../Models/File/image.js';
import { promisify } from 'util';
import { error } from 'console';
cloudinary.v2.config({
     cloud_name: "dozs7ggs4",
     api_key: "749332554812144",
     api_secret: "nz5Sg21DZI5JLkT2l9TQa86t5e8",
});

const storageVideo = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
       resource_type: 'video',
       allowed_formats: ['mp4', 'avi'], 
     },
});

const storage = multer.memoryStorage();
const uploadSetupImage = multer({ storage: storage });
const uploadSetupVideo = multer({ storage: storage});
const uploadImageAsync = promisify(uploadSetupImage.single('image'));
const uploadVideoAsync = promisify(uploadSetupVideo.single('video'));


export const handleImageUpload = async(req, res, next) => {
     try {
          await uploadImageAsync(req, res);
          next();
     } catch (err) {
          console.error(err);
          return res.status(400).json({ error: 'Invalid file format or size' });
     }
};

export const handleVideoUpload = async(req, res, next) => {
     try {
          await uploadVideoAsync(req, res);
          next();
     } catch (err) {
          console.error(err);
          return res.status(400).json({ error: 'Invalid file format or size' });
     }
};


export const uploadImage = async(req, res) => {
     try {
          if (!req.file) {
            return res.status(400).json({ error: 'Khong tim thay file dc chon' });
          }
          const uploadStream = await cloudinary.uploader.upload_stream((error, result) => {
               if (error) {
                    return res.send(error.url)
               }
               console.log(result)
          });
          uploadStream.end(req.file.buffer);
     } catch (error) {
          console.log("Loi khi tai anh 2");
          res.status(500).json({ error: 'Server gap van de' });
     }
}



export const uploadVideo = async(req, res) => {
     try {
          if (!req.file) {
               return res.status(400).json({ error: 'Khong tim thay file dc chon' });
          }

          console.log(req.file)
          const upload = cloudinary.uploader.upload_stream(req.file.path, {resource_type: 'video'}, (error, result) => {
               res.send(result.secure_url)
          })
          res.json({
               success: true,
               message: "Tải video thành công"
          });
          
          upload.end(req.file.buffer);

          
          
     } catch (error) {
          console.log("Loi khi tai anh 2");
          console.log(error)
          res.status(500).json({ error: 'Server gap van de' });
     }
}
