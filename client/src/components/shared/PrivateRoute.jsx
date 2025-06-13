// PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

// AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user && hasRole('admin') ? children : <Navigate to="/" replace />;
};

export default AdminRoute;