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

  // Initialize user from localStorage
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

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login' && location.pathname !== '/register') {
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
      
      // Redirect to intended page or based on role
      const from = location.state?.from?.pathname || 
                 (userData.role === 'admin' ? '/admin/dashboard' :
                  userData.role === 'agent' ? '/agent/dashboard' : '/dashboard');
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
      const registeredUser = await authService.register(userData);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      setError(null);
      navigate(registeredUser.role === 'admin' ? '/admin/dashboard' : '/dashboard');
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

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isAgent: user?.role === 'agent',
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