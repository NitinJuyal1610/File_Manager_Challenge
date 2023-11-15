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

const deleteFile = catchAsync(async (req, res) => {
  const { fileId } = req.params;
  const user = req.user as User;
  await fileService.deleteFile(fileId, user);
  return res.status(httpStatus.OK).json({
    message: `File with id ${fileId} deleted successfully`
  });
});

const renameFile = catchAsync(async (req, res) => {
  const { fileId } = req.params;
  const { newName } = req.body;
  const user = req.user as User;
  await fileService.renameFile(fileId, user, newName);
  return res.status(httpStatus.OK).json({
    message: `File with id ${fileId} renamed successfully`
  });
});

const moveFile = catchAsync(async (req, res) => {
  const { fileId, destinationId } = req.params;
  const user = req.user as User;
  await fileService.moveFile(fileId, user, destinationId);
  return res.status(httpStatus.OK).json({
    message: `File with id ${fileId} moved successfully`
  });
});

export default {
  uploadFile,
  deleteFile,
  renameFile,
  moveFile
};
