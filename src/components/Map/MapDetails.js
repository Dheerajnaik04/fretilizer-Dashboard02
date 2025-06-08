import React from 'react';
import IndiaMap from './IndiaMap';

const MapDetails = ({ data }) => {
  return (
    <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 px-4">Detailed Map Analysis</h2>
      <IndiaMap data={data} title="Detailed Fertilizer Net Balance Map" />
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md mx-4 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Further Map Insights</h3>
        <p className="text-gray-700 dark:text-gray-300">
          This section can be expanded to include more granular map interactions,
          time-series analysis for selected states, comparisons between regions,
          and other geographical insights related to fertilizer data.
        </p>
        <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <p className="text-gray-600 dark:text-gray-400 italic">
            Example: Add controls here to filter map data by specific months, products,
            or to view historical trends for selected states. (Phase 3 idea)
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapDetails;