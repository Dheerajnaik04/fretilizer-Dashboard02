import React, { useMemo } from 'react';
import { AttachMoney, ShowChart, Balance, TrendingUp } from '@mui/icons-material';

const KPIsOverview = ({ data }) => {
  const kpis = useMemo(() => {
    let totalRequirement = 0;
    let totalAvailability = 0;

    data.forEach(item => {
      totalRequirement += parseFloat(item.requirement_in_mt_ || 0) || 0;
      totalAvailability += parseFloat(item.availability_in_mt_ || 0) || 0;
    });

    const netBalance = totalAvailability - totalRequirement;
    const fulfillmentRate = totalRequirement > 0
      ? (totalAvailability / totalRequirement * 100).toFixed(2)
      : 0;

    return {
      totalRequirement,
      totalAvailability,
      netBalance,
      fulfillmentRate,
    };
  }, [data]);

  const formatNumber = (num) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const balanceText = kpis.netBalance >= 0 ? 'Surplus' : 'Deficit';
  const balanceColor = kpis.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const balanceBg = kpis.netBalance >= 0 ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mb-6">
      <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Requirement</h4>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{formatNumber(kpis.totalRequirement)} MT</p>
        </div>
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-200">
          <AttachMoney style={{ fontSize: '2rem' }} />
        </div>
      </div>

      <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300">Total Availability</h4>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{formatNumber(kpis.totalAvailability)} MT</p>
        </div>
        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-700 text-purple-600 dark:text-purple-200">
          <ShowChart style={{ fontSize: '2rem' }} />
        </div>
      </div>

      <div className={`flex items-center justify-between p-5 rounded-lg shadow-md transition-colors duration-300 ${balanceBg}`}>
        <div className="flex-1">
          <h4 className={`text-lg font-medium ${balanceColor}`}>Net Balance</h4>
          <p className={`text-2xl font-bold ${balanceColor} mt-1`}>{formatNumber(Math.abs(kpis.netBalance))} MT ({balanceText})</p>
        </div>
        <div className={`p-3 rounded-full ${balanceColor} opacity-75`}>
          <Balance style={{ fontSize: '2rem' }} />
        </div>
      </div>

      <div className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
        <div className="flex-1">
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300">Fulfillment Rate</h4>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{kpis.fulfillmentRate}%</p>
        </div>
        <div className="p-3 rounded-full bg-green-100 dark:bg-green-700 text-green-600 dark:text-green-200">
          <TrendingUp style={{ fontSize: '2rem' }} />
        </div>
      </div>
    </div>
  );
};

export default KPIsOverview;