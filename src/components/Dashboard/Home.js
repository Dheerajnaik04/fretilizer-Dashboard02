import React from 'react';
import KPIsOverview from './KPIsOverview';
import Bigchart from '../Charts/Bigchart';
import Chart from '../Charts/Chart';
import Piechart from '../Charts/Piechart';

const Home = ({ data }) => {
  return (
    <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 px-4">Analytics Dashboard</h2>
      <KPIsOverview data={data} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Bigchart title="Monthly Fertilizer Requirement & Availability by Product" data={data} />
        <Chart title="Product Requirement by State" data={data} parent="state" child="product" valueKey="requirement_in_mt_" subtitle="Overview" defaultValue={{ state: 'Uttar Pradesh' }} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Piechart data={data} title="Top 5 Products by Requirement" dataKey="requirement_in_mt_" />
        <Piechart data={data} title="Top 5 Products by Least Availability" dataKey="availability_in_mt_" isAscending={true} />
      </div>
    </div>
  );
};

export default Home;