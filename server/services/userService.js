import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { USER_ROLES } from '../utils/constants.js';

export const getAllUsers = async () => {
  return await User.find({}).select('-password');
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export const updateUser = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser) {
      throw new ApiError(400, 'Email already in use');
    }
  }

  Object.assign(user, updateData);
  await user.save();

  return user;
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};