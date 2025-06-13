import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import { ThemeProvider } from './components/contexts/ThemeContext';
import Navbar from './components/shared/Navbar';
import Loader from './components/shared/Loader';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import AgentDashboard from './components/dashboard/AgentDashboard';
import Tickets from './components/pages/Tickets';
import UserManagement from "./components/users/UserManagement"; // Updated import

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/tickets" element={user ? <Tickets /> : <Navigate to="/login" replace />} />
      
      <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} />
      <Route path="/admin/users" element={user?.role === 'admin' ? <UserManagement /> : <Navigate to="/" replace />} />
      
      <Route path="/agent/dashboard" element={user?.role === 'agent' ? <AgentDashboard /> : <Navigate to="/" replace />} />
      
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <main className="container mx-auto py-6 px-4">
              <AppRoutes />
            </main>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;