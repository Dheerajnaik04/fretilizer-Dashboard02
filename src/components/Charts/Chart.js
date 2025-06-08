import React, { useState, useMemo, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';
import { ThemeContext } from '../Common/ThemeContext';

const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const getData = (data, parent, child, valueKey) => {
  const groupedData = {};
  const aggregated = data.reduce((acc, item) => {
    const parentName = item[parent];
    const childName = item[child];
    const value = parseFloat(item[valueKey]) || 0;
    if (!acc[parentName]) acc[parentName] = {};
    if (!acc[parentName][childName]) acc[parentName][childName] = 0;
    acc[parentName][childName] += value;
    return acc;
  }, {});

  for (const parentName in aggregated) {
    if (Object.hasOwnProperty.call(aggregated, parentName)) {
      if (!groupedData[parentName]) groupedData[parentName] = [];
      for (const childName in aggregated[parentName]) {
        if (Object.hasOwnProperty.call(aggregated[parentName], childName)) {
          groupedData[parentName].push({ [child]: childName, value: aggregated[parentName][childName] });
        }
      }
      groupedData[parentName].sort((a, b) => {
        if (typeof a[child] === 'string' && typeof b[child] === 'string') return a[child].localeCompare(b[child]);
        return 0;
      });
    }
  }
  return groupedData;
};


const Chart = ({ title, data, parent, child, valueKey, subtitle, defaultValue }) => {
  const { theme } = useContext(ThemeContext);
  const aggregatedData = useMemo(() => {
    return getData(data, parent, child, valueKey);
  }, [data, parent, child, valueKey]);

  const [view, setView] = useState(() => {
    const initialKeys = Object.keys(aggregatedData);
    if (defaultValue && defaultValue[parent] && aggregatedData[defaultValue[parent]]) {
      return defaultValue[parent];
    }
    return initialKeys.length > 0 ? initialKeys[0] : '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentChartData, setCurrentChartData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setCurrentChartData(aggregatedData[view] || []);
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [aggregatedData, view]);

  return (
    <div className="m-4 p-5 shadow-lg rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300">
      <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-5 ml-2 gap-4">
        <h5 className="text-gray-700 dark:text-gray-300 mr-2">
          {capitalizeWords(parent)} {subtitle}:
        </h5>
        <select
          onChange={(e) => setView(e.target.value)}
          value={view}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-blue-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors duration-200"
          aria-label={`Select ${capitalizeWords(parent)}`}
        >
          {Object.keys(aggregatedData).map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        {!isLoading && !currentChartData.length && (
          <h6 className="ml-2 mt-2 sm:mt-0 text-red-500 text-base">No data available for this selection</h6>
        )}
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ResponsiveContainer width="100%" aspect={2 / 1} className="min-h-[300px]">
          <BarChart
            data={currentChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDashArray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
            <XAxis dataKey={child} className="text-sm text-gray-700 dark:text-gray-300" />
            <YAxis className="text-sm text-gray-700 dark:text-gray-300" />
            <Tooltip
              contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(31,41,55,0.95)' : 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              labelStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#333' }}
              itemStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#333' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', color: theme === 'dark' ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)' }} />
            <Bar dataKey="value" fill="#60AC4A" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;