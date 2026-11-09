import multer from 'multer';
import path from 'path';

// Allowed file extensions matching supported source code languages
const ALLOWED_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.c', '.cpp',
  '.h', '.hpp', '.cs', '.go', '.rs', '.php', '.dart', '.kt', '.swift'
]);

// Memory storage to process uploaded code directly as text without leaving residual disk files
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(
      new Error(`Unsupported file type: ${ext}. Only source code files are allowed.`),
      false
    );
  }

  cb(null, true);
};

export const uploadSourceFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10), // Default 5 MB
  },
});