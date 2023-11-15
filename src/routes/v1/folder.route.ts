import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { folderValidation } from '../../validations';
import { folderController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(
    auth('createFolder'),
    validate(folderValidation.createFolder),
    folderController.createFolder
  );

router
  .route('/:parentId')
  .post(
    auth('createFolder'),
    validate(folderValidation.createFolder),
    folderController.createSubFolder
  );

export default router;
