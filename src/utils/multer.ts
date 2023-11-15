import multer from 'multer';

export const MulterUpload = multer({
  dest: 'uploads/'
});
