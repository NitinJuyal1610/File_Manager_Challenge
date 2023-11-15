import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: ['createFolder'],
  [Role.ADMIN]: ['getUsers', 'manageUsers', 'createFolder']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
