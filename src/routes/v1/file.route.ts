import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { fileValidation } from '../../validations';
import { fileController } from '../../controllers';
import { MulterUpload } from '../../utils/multer';
const router = express.Router();

router
  .route('/')
  .post(
    auth('uploadFile'),
    MulterUpload.single('file'),
    validate(fileValidation.uploadFile),
    fileController.uploadFile
  );

export default router;
