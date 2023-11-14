import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService } from '../services';
import exclude from '../utils/exclude';

import { generateToken } from '../utils/generateToken';

const register = catchAsync(async (req, res) => {
  const { email, password, name } = req.body;
  const user = await userService.createUser(email, password, name);
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);
  res.status(httpStatus.CREATED).json({ user: userWithoutPassword });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = generateToken(user.id);
  res.json({ token });
});

export default {
  register,
  login
};
