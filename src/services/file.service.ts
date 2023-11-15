import { User } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { uploadFile, deleteObject, moveObject } from '../utils/awsUtils';
import path from 'path';

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

const deleteFile = async (fileId: number, user: User) => {
  const file = await getFileById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  if (file.userId !== user.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  if (await deleteObject(file.path)) {
    await prisma.file.delete({
      where: {
        id: fileId
      }
    });
  }
  return true;
};

const renameFile = async (fileId: number, user: User, newName: string) => {
  const file = await getFileById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  if (file.userId !== user.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const extension = path.extname(file.path);
  const folderName = path.dirname(file.path);
  const newKey = `${folderName}/${newName}${extension}`;

  if (newKey === file.path) {
    return true;
  }

  const existingFile = await prisma.file.findFirst({
    where: {
      path: newKey
    }
  });

  if (existingFile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File already exists with this name');
  }

  if (await moveObject(file.path, newKey)) {
    return await prisma.file.update({
      where: {
        id: fileId
      },
      data: {
        name: newName,
        path: newKey
      }
    });
  }
  return true;
};

const moveFile = async (fileId: number, user: User, folderId: number) => {
  const file = await getFileById(fileId);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  if (file.userId !== user.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId
    }
  });

  if (!folder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Destination Folder not found');
  }

  if (!(folder.userId === user.id)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const newPath = `${folder.path}${file.name}`;
  const existingFile = await prisma.file.findFirst({
    where: {
      path: newPath
    }
  });

  if (existingFile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'File already exists with this name in the Destination Folder'
    );
  }
  if (await moveObject(file.path, newPath)) {
    return await prisma.file.update({
      where: {
        id: fileId
      },
      data: {
        folderId,
        path: newPath
      }
    });
  }
  return true;
};

const getFileById = async (fileId: number) => {
  const file = await prisma.file.findFirst({
    where: {
      id: fileId
    }
  });
  return file;
};

export default {
  createFile,
  deleteFile,
  renameFile,
  moveFile
};
