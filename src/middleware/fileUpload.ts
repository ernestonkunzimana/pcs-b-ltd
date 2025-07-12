import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { logger } from '../config/logger';

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: Function) {
    const uploadPath = process.env.UPLOAD_DIR || 'uploads';
    cb(null, uploadPath);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx,xls,xlsx').split(',');
  const fileExtension = path.extname(file.originalname).toLowerCase().replace('.', '');
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
});

export const uploadSingle = (fieldName: string) => {
  return (req: Request, res: any, next: any) => {
    const uploadHandler = upload.single(fieldName);
    
    uploadHandler(req, res, (err: any) => {
      if (err) {
        logger.error('File upload error:', err);
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
          error: err.message,
        });
      }
      next();
    });
  };
};

export const uploadMultiple = (fieldName: string, maxCount: number = 10) => {
  return (req: Request, res: any, next: any) => {
    const uploadHandler = upload.array(fieldName, maxCount);
    
    uploadHandler(req, res, (err: any) => {
      if (err) {
        logger.error('File upload error:', err);
        return res.status(400).json({
          success: false,
          message: 'File upload failed',
          error: err.message,
        });
      }
      next();
    });
  };
};