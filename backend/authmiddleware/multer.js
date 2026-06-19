import multer from 'multer';
import CustomError from './customerror.js';


// Store files in memory as raw Buffers instead of saving local disk files
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit files to 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Ensure the file is an actual image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new CustomError(400, 'Only image files are allowed!'), false);
    }
  },
});

export default upload;