import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: ['createFolder', 'uploadFile'],
  [Role.ADMIN]: ['getUsers', 'manageUsers', 'createFolder', 'uploadFile']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
