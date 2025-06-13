import { USER_ROLES } from './constants.js';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const hasPermission = (userRole, requiredPermission) => {
  const permissions = {
    [USER_ROLES.ADMIN]: ['create', 'read', 'update', 'delete', 'manage_users'],
    [USER_ROLES.AGENT]: ['create', 'read', 'update', 'assign_tickets'],
    [USER_ROLES.USER]: ['create', 'read']
  };
  
  return permissions[userRole]?.includes(requiredPermission) || false;
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};