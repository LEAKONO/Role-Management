import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Updated import path
import {
  HomeIcon,
  TicketIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Ticket System</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive 
              ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
          }
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          Dashboard
        </NavLink>

        <NavLink 
          to="/tickets" 
          className={({ isActive }) => 
            `flex items-center p-2 rounded-lg ${isActive 
              ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
          }
        >
          <TicketIcon className="h-5 w-5 mr-3" />
          Tickets
        </NavLink>

        {user?.role === 'admin' && (
          <>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg ${isActive 
                  ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              <ChartBarIcon className="h-5 w-5 mr-3" />
              Admin Dashboard
            </NavLink>

            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-lg ${isActive 
                  ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
              }
            >
              <UsersIcon className="h-5 w-5 mr-3" />
              User Management
            </NavLink>
          </>
        )}

        {user?.role === 'agent' && (
          <NavLink 
            to="/agent/dashboard" 
            className={({ isActive }) => 
              `flex items-center p-2 rounded-lg ${isActive 
                ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' 
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`
            }
          >
            <ChartBarIcon className="h-5 w-5 mr-3" />
            Agent Dashboard
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;