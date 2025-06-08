import React from 'react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full min-h-[100px]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
    <p className="ml-3 text-gray-600 dark:text-gray-300">Loading data...</p>
  </div>
);

export default LoadingSpinner;