
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  USER: 'user'
};

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const LOCAL_STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  THEME: 'theme'
};

export const TOAST_DURATION = 5000; // 5 seconds