import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      
      req.user.lastActive = new Date();
      await req.user.save();
      
      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    console.log(`Admin access denied for user ${req.user?._id}`);
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

const adminOrAgent = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'agent')) {
    next();
  } else {
    console.log(`Admin/Agent access denied for user ${req.user?._id}`);
    res.status(403);
    throw new Error('Not authorized as admin or agent');
  }
};

const agent = (req, res, next) => {
  if (req.user?.role === 'agent') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as agent');
  }
};

export { protect, admin, adminOrAgent, agent };