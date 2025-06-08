import React, { useState, useMemo, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';
import { ThemeContext } from '../Common/ThemeContext';

const Bigchart = ({ title, data }) => {
  const { theme } = useContext(ThemeContext);
  const months = useMemo(() => {
    const dataMonths = [...new Set(data.map(item => item.month))].filter(Boolean);
    const orderedMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return orderedMonths.filter(m => dataMonths.includes(m));
  }, [data]);

  const states = useMemo(() => {
    const uniqueStates = [...new Set(data.map(item => item.state))].sort();
    return uniqueStates.length > 0 ? uniqueStates : [
      "Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
      "Chandigarh", "Chhattisgarh", "Dadra & Nagar Haveli", "Delhi", "Goa",
      "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand",
      "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
      "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
      "Tamil Nadu", "Tripura", "Telangana", "Uttar Pradesh", "Uttarakhand",
      "West Bengal", "Daman & Diu", "Lakshadweep", "Sikkim",
    ];
  }, [data]);

  const products = useMemo(() => {
    const uniqueProducts = [...new Set(data.map(item => item.product))].filter(Boolean).sort();
    return ['All Products', ...uniqueProducts];
  }, [data]);


  const [stateValue, setStateValue] = useState(states[0]);
  const [monthValue, setMonthValue] = useState(months[0]);
  const [productValue, setProductValue] = useState(products[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChartData, setCurrentChartData] = useState([]);

  useEffect(() => {
    if (states.length > 0 && months.length > 0 && products.length > 0) {
      if (states[0] !== stateValue) setStateValue(states[0]);
      if (months[0] !== monthValue) setMonthValue(months[0]);
      if (products[0] !== productValue) setProductValue(products[0]);
    }
  }, [states, months, products]);

  useEffect(() => {
    if (!stateValue || !monthValue || !productValue) return;

    setIsLoading(true);
    const timer = setTimeout(() => {
      let filteredData = data.filter((obj) => {
        const stateMatch = (obj.state === stateValue);
        const monthMatch = (obj.month === monthValue);
        const productMatch = (productValue === 'All Products' || obj.product === productValue);
        return stateMatch && monthMatch && productMatch;
      });

      if (productValue !== 'All Products') {
        const monthlyData = months.map(month => {
          const monthItems = filteredData.filter(item => item.month === month && item.product === productValue);
          const requirement = monthItems.reduce((sum, item) => sum + (parseFloat(item.requirement_in_mt_) || 0), 0);
          const availability = monthItems.reduce((sum, item) => sum + (parseFloat(item.availability_in_mt_) || 0), 0);
          return { month, requirement_in_mt_: requirement, availability_in_mt_: availability };
        }).filter(item => item.requirement_in_mt_ > 0 || item.availability_in_mt_ > 0);
        setCurrentChartData(monthlyData);
      } else {
        filteredData = filteredData.map(item => ({
          ...item,
          requirement_in_mt_: parseFloat(item.requirement_in_mt_ || 0) || 0,
          availability_in_mt_: parseFloat(item.availability_in_mt_ || 0) || 0,
        }));
        setCurrentChartData(filteredData);
      }

      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [data, stateValue, monthValue, productValue, months]);


  return (
    <div className="m-4 p-5 shadow-lg rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300">
      <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-5 ml-2 gap-4 flex-wrap">
        <h5 className="text-gray-700 dark:text-gray-300 mr-2">Month:</h5>
        <select
          onChange={(e) => {
            setMonthValue(e.target.value);
            if (productValue !== 'All Products' && currentChartData.some(d => d.product)) {
              setProductValue('All Products');
            }
          }}
          value={monthValue}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-blue-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors duration-200"
          aria-label="Select Month"
        >
          {months.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <h5 className="text-gray-700 dark:text-gray-300 mr-2">State:</h5>
        <select
          onChange={(e) => {
            setStateValue(e.target.value);
            if (productValue !== 'All Products' && currentChartData.some(d => d.product)) {
              setProductValue('All Products');
            }
          }}
          value={stateValue}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-blue-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors duration-200"
          aria-label="Select State"
        >
          {states.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <h5 className="text-gray-700 dark:text-gray-300 mr-2">Product:</h5>
        <select
          onChange={(e) => setProductValue(e.target.value)}
          value={productValue}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-blue-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors duration-200"
          aria-label="Select Product"
        >
          {products.map((e) => (
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
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
            <XAxis dataKey={productValue === 'All Products' ? "product" : "month"} className="text-sm text-gray-700 dark:text-gray-300" />
            <YAxis className="text-sm text-gray-700 dark:text-gray-300" />
            <Tooltip
              contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(31,41,55,0.95)' : 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              labelStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#333' }}
              itemStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#333' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', color: theme === 'dark' ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)' }} />
            <Bar dataKey="requirement_in_mt_" fill="#60AC4A" name="Requirement (MT)" />
            <Bar dataKey="availability_in_mt_" fill="#FF6347" name="Availability (MT)" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Bigchart;