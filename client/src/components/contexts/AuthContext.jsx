import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        
        if (storedUser?.token) {
          const userData = await authService.getProfile(storedUser.token);
          setUser({ ...storedUser, ...userData });
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!loading && !user && !['/login', '/register'].includes(location.pathname)) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [user, loading, navigate, location]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const userData = await authService.login(credentials);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError(null);
      
      const from = location.state?.from?.pathname || getDashboardPath(userData.role);
      navigate(from, { replace: true });
      
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Validate role before registration
      const validRoles = ['user', 'agent']; // Add 'admin' if needed
      if (!validRoles.includes(userData.role)) {
        throw new Error('Invalid role specified');
      }

      const registeredUser = await authService.register(userData);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      setError(null);
      
      navigate(getDashboardPath(registeredUser.role));
      return registeredUser;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(profileData, user.token);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setError(null);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardPath = (role) => {
    switch(role) {
      case 'admin': return '/admin/dashboard';
      case 'agent': return '/agent/dashboard';
      default: return '/dashboard';
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent',
    isUser: user?.role === 'user',
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};