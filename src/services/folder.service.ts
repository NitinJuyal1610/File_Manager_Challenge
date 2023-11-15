import { User, Folder } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { createEmptyObject } from '../utils/awsUtils';

const newFolder = async (name: string, user: User): Promise<Folder | null> => {
  const targetPath = `${name}/`;
  const existingFolder = await getFolder(targetPath);
  if (existingFolder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Folder already exists with this name');
  }

  if (await createEmptyObject(targetPath)) {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId: user.id,
        path: targetPath
      }
    });
    return folder;
  }
  return null;
};

const newSubFolder = async (parentId: number, name: string, user: User): Promise<Folder | null> => {
  const parentFolder = await prisma.folder.findUnique({
    where: {
      id: parentId
    }
  });
  if (!parentFolder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Parent folder not found');
  }

  if (parentFolder.userId !== user.id) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const targetPath = `${parentFolder.path}${name}/`;
  const existingFolder = await getFolder(targetPath);
  if (existingFolder) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'SubFolder already exists with this name');
  }
  if (await createEmptyObject(targetPath)) {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId: user.id,
        parentId,
        path: targetPath
      }
    });
    return folder;
  }
  return null;
};

export const getFolder = async (path: string): Promise<Folder | null> => {
  const folder = await prisma.folder.findUnique({
    where: {
      path: path
    }
  });
  return folder;
};

export default {
  newFolder,
  newSubFolder
};
