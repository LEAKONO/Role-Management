import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
    role: req.body.role || 'user',
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email })
    .select('+password +loginAttempts +accountLocked +lockUntil');

  if (user?.accountLocked && user.lockUntil > Date.now()) {
    const lockTimeLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
    res.status(403);
    throw new Error(`Account locked. Try again in ${lockTimeLeft} minutes`);
  }

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.matchPassword(password).catch(() => false);
  
  if (!isMatch) {
    await user.incrementLoginAttempts();
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Reset login attempts and update last login
  if (user.loginAttempts > 0 || user.accountLocked) {
    await user.resetLoginAttempts();
  }
  
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false }); // Skip validation

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.avatar = req.body.avatar || user.avatar;

  if (req.body.password) {
    user.password = req.body.password;
    user.passwordChangedAt = Date.now();
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role,
    avatar: updatedUser.avatar,
    token: generateToken(updatedUser._id),
  });
});

export { registerUser, loginUser, getUserProfile, updateUserProfile };