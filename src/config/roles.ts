import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: ['createFolder', 'uploadFile', 'deleteFile', 'renameFile', 'moveFile'],
  [Role.ADMIN]: ['getUsers', 'manageUsers', 'createFolder', 'uploadFile', 'deleteFile']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
