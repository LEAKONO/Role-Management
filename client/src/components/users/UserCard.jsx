import { formatDate } from '../utils/helpers';

const UserCard = ({ user }) => {
  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    agent: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 text-lg font-medium">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {user.username}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
            {user.role}
          </span>
          <span className="text-sm text-gray-500">
            Joined {formatDate(user.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;