import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import fileService from '../services/file.service';
import { User } from '@prisma/client';

const uploadFile = catchAsync(async (req, res) => {
  const { folderId } = req.body;
  const file = req.file as Express.Multer.File;
  const user = req.user as User;
  const uploadedFile = await fileService.createFile(file, folderId, user);
  return res.status(httpStatus.CREATED).json({
    message: 'File uploaded successfully',
    file: uploadedFile
  });
});

export default {
  uploadFile
};
