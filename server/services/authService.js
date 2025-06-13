import User from '../models/User.js';
import { USER_ROLES } from '../utils/constants.js';
import { validateEmail } from '../utils/helpers.js';
import ApiError from '../utils/ApiError.js';

export const registerUser = async (userData) => {
  if (!validateEmail(userData.email)) {
    throw new ApiError(400, 'Invalid email format');
  }

  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new ApiError(400, 'Email already in use');
  }

  const user = await User.create({
    ...userData,
    role: userData.role || USER_ROLES.USER
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  user.lastLogin = new Date();
  await user.save();

  return user;
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};