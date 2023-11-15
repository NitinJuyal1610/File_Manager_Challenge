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

router
  .route('/:fileId')
  .delete(auth('deleteFile'), validate(fileValidation.deleteFile), fileController.deleteFile);

router
  .route('/:fileId/rename')
  .patch(auth('renameFile'), validate(fileValidation.renameFile), fileController.renameFile);

router
  .route('/:fileId/move/:destinationId')
  .patch(auth('moveFile'), validate(fileValidation.moveFile), fileController.moveFile);

export default router;
