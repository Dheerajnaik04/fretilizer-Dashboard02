import React, { useState, useMemo, useEffect, useContext } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';
import { ThemeContext } from '../Common/ThemeContext';


const getPieData = (data, dataKey, isAscending = false) => {
  const productSums = data.reduce((acc, item) => {
    const product = item.product;
    const value = parseFloat(item[dataKey]) || 0;
    acc[product] = (acc[product] || 0) + value;
    return acc;
  }, {});

  const sortedProducts = Object.entries(productSums)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => isAscending ? a.value - b.value : b.value - a.value);

  return sortedProducts.slice(0, 5);
};


const Piechart = ({ data, title, dataKey, isAscending = false }) => {
  const { theme } = useContext(ThemeContext);
  const chartData = useMemo(() => getPieData(data, dataKey, isAscending), [data, dataKey, isAscending]);
  const COLORS = useMemo(() => ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000"], []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [data, dataKey, isAscending]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="m-4 p-5 shadow-lg rounded-lg bg-white dark:bg-gray-800 flex-grow transition-colors duration-300">
      <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ResponsiveContainer width="100%" aspect={1 / 1} className="min-h-[350px]">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: theme === 'dark' ? 'rgba(31,41,55,0.95)' : 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              labelStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#333' }}
              itemStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#333' }}
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Piechart;