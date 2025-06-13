const roles = {
  admin: ['create', 'read', 'update', 'delete', 'manageUsers'],
  agent: ['create', 'read', 'update', 'assign'],
  user: ['create', 'read']
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (!roles[userRole] || !roles[userRole].includes(requiredPermission)) {
      return res.status(403).json({ 
        message: `Forbidden: ${userRole} role doesn't have ${requiredPermission} permission` 
      });
    }
    
    next();
  };
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action'
      });
    }
    
    next();
  };
};

export { checkPermission, restrictTo };