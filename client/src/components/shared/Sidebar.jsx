import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { 
  HomeIcon, 
  UsersIcon, 
  TicketIcon, 
  ChartBarIcon,
  CogIcon 
} from '@heroicons/react/outline';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: HomeIcon,
      roles: ['admin', 'agent', 'user'],
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: UsersIcon,
      roles: ['admin'],
    },
    {
      name: 'Tickets',
      path: '/tickets',
      icon: TicketIcon,
      roles: ['admin', 'agent', 'user'],
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: ChartBarIcon,
      roles: ['admin', 'agent'],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: CogIcon,
      roles: ['admin', 'agent', 'user'],
    },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white dark:bg-gray-800">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              if (!item.roles.includes(user?.role)) return null;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => 
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={user?.avatar || '/default-avatar.png'}
                alt="User avatar"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-white">
                {user?.username}
              </p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-300">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;