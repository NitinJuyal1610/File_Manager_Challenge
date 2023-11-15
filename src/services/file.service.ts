import { User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { uploadFile } from '../utils/awsUtils';

const createFile = async (file: Express.Multer.File, folderId: number, user: User) => {
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId
    }
  });
  if (!folder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Folder not found');
  }

  if (!(folder.userId === user.id)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const targetPath = `${folder.path}${file.originalname}`;

  const existingFile = await prisma.file.findFirst({
    where: {
      path: targetPath
    }
  });

  console.log(existingFile);
  if (existingFile)
    throw new ApiError(httpStatus.BAD_REQUEST, 'File already exists with this name');

  if (await uploadFile(targetPath, file.originalname, file.path)) {
    return await prisma.file.create({
      data: {
        name: file.originalname,
        userId: user.id,
        folderId,
        path: targetPath,
        size: file.size
      }
    });
  }
  return null;
};

export default {
  createFile
};
