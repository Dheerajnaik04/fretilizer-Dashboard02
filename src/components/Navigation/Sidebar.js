import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Inventory2, Map as MapIcon } from '@mui/icons-material';

const Sidebar = () => {
  return (
    <div className="flex-none bg-gray-100 dark:bg-gray-800 h-[calc(100vh-64px)] sticky top-[64px] rounded-r-lg shadow-xl transition-colors duration-300">
      <div className="p-5 pt-0 text-gray-600 dark:text-gray-300">
        <div className="mb-2.5">
          <h3 className="text-lg text-green-700 dark:text-green-400 mb-2 font-semibold">Dashboard</h3>
          <ul className="list-none p-1.5">
            <Link to="/" className="no-underline text-gray-600 dark:text-gray-300">
              <li className="p-2 flex items-center cursor-pointer rounded-lg hover:bg-green-100 dark:hover:bg-green-800 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
                <TrendingUp className="mr-2 text-xl" />
                Analytics
              </li>
            </Link>
            <Link to="/product" className="no-underline text-gray-600 dark:text-gray-300">
              <li className="p-2 flex items-center cursor-pointer rounded-lg hover:bg-green-100 dark:hover:bg-green-800 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 mt-1">
                <Inventory2 className="mr-2 text-xl" />
                Products
              </li>
            </Link>
            <Link to="/map-details" className="no-underline text-gray-600 dark:text-gray-300">
              <li className="p-2 flex items-center cursor-pointer rounded-lg hover:bg-green-100 dark:hover:bg-green-800 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 mt-1">
                <MapIcon className="mr-2 text-xl" />
                Map Details
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;