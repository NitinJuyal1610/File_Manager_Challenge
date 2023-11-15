import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';

import { folderService } from '../services';
import { User } from '@prisma/client';

const createFolder = catchAsync(async (req, res) => {
  const { name } = req.body;
  const user = req.user as User;
  const folder = await folderService.newFolder(name, user);
  return res.json({ message: 'Folder created successfully', folder });
});

const createSubFolder = catchAsync(async (req, res) => {
  const { parentId } = req.params;
  const { name } = req.body;
  const user = req.user as User;
  const folder = await folderService.newSubFolder(parentId, name, user);
  return res.json({ message: 'SubFolder created successfully', folder });
});

export default {
  createFolder,
  createSubFolder
};
