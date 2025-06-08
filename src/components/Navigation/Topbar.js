import React, { useContext } from 'react';
import { NotificationsNone, Settings, Language, Menu as MenuIcon, LightMode, DarkMode } from '@mui/icons-material';
import { ThemeContext } from '../Common/ThemeContext';

const Topbar = ({ isSidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="w-full h-16 bg-gray-100 dark:bg-gray-900 sticky top-0 z-50 shadow-md transition-colors duration-300">
      <div className="h-full px-5 flex items-center justify-between">
        <div className="flex items-center">
          <span className="font-bold text-3xl text-green-600 dark:text-green-400 cursor-pointer">Fyllo</span>
          <div
            className="md:hidden ml-5 cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            role="button"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon className="text-gray-600 dark:text-gray-300 text-xl" />
          </div>
        </div>
        <div className="flex items-center">
          <div className="relative cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm text-gray-600 dark:text-gray-300">
            <NotificationsNone />
            <span className="absolute top-1.5 right-2 bg-red-500 text-white rounded-full h-4 w-4 text-xs flex justify-center items-center">2</span>
          </div>
          <div className="relative cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm text-gray-600 dark:text-gray-300">
            <Language />
            <span className="absolute top-1.5 right-2 bg-red-500 text-white rounded-full h-4 w-4 text-xs flex justify-center items-center">2</span>
          </div>
          <div className="relative cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm text-gray-600 dark:text-gray-300">
            <Settings />
          </div>
          <div
            className="relative cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm text-gray-600 dark:text-gray-300"
            onClick={toggleTheme}
            role="button"
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <DarkMode /> : <LightMode />}
          </div>
          <img src="https://cdn-icons-png.flaticon.com/512/147/147144.png" alt="profile" className="w-10 h-10 rounded-full cursor-pointer ml-2" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;