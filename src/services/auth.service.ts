import httpStatus from 'http-status';

import userService from './user.service';
import ApiError from '../utils/ApiError';
import { User } from '@prisma/client';

import { encryptPassword, isPasswordMatch } from '../utils/encryption';
import exclude from '../utils/exclude';

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<Omit<User, 'password'>> => {
  const user = await userService.getUserByEmail(email, [
    'id',
    'email',
    'name',
    'role',
    'password',
    'createdAt',
    'updatedAt'
  ]);
  if (!user || !(await isPasswordMatch(password, user.password as string))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return exclude(user, ['password']);
};

export default {
  loginUserWithEmailAndPassword,
  isPasswordMatch,
  encryptPassword
};
