import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} p-6 rounded-lg shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white bg-opacity-20">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;