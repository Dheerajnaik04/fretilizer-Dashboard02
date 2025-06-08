import React, { useState, useMemo } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

const Product = ({ data }) => {
  const [filterYear, setFilterYear] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterState, setFilterState] = useState('All');

  const [aggregatedSortConfig, setAggregatedSortConfig] = useState({ key: 'product', direction: 'ascending' });
  const [rawDataSortConfig, setRawDataSortConfig] = useState({ key: 'id', direction: 'ascending' });

  const [searchTerms, setSearchTerms] = useState({
    _year: '',
    month: '',
    state: '',
    product: '',
    requirement_in_mt_: '',
    availability_in_mt_: '',
    id: '',
  });


  const uniqueYears = useMemo(() => {
    const years = [...new Set(data.map(item => item._year ? item._year.toString() : null).filter(Boolean))].sort();
    return ['All', ...years];
  }, [data]);

  const uniqueMonths = useMemo(() => {
    const dataMonths = [...new Set(data.map(item => item.month).filter(Boolean))];
    const orderedMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const sortedMonths = orderedMonths.filter(m => dataMonths.includes(m));
    return ['All', ...sortedMonths];
  }, [data]);

  const uniqueStates = useMemo(() => {
    const states = [...new Set(data.map(item => item.state).filter(Boolean))].sort();
    return ['All', ...states];
  }, [data]);

  const filteredData = useMemo(() => {
    let result = data.filter(item => {
      const matchesYear = filterYear === 'All' || (item._year && item._year.toString() === filterYear);
      const matchesMonth = filterMonth === 'All' || (item.month && item.month === filterMonth);
      const matchesState = filterState === 'All' || (item.state && item.state === filterState);

      const searchYear = searchTerms._year.toLowerCase();
      const searchMonth = searchTerms.month.toLowerCase();
      const searchState = searchTerms.state.toLowerCase();
      const searchProduct = searchTerms.product.toLowerCase();
      const searchReq = searchTerms.requirement_in_mt_.toLowerCase();
      const searchAvail = searchTerms.availability_in_mt_.toLowerCase();
      const searchId = searchTerms.id.toLowerCase();


      const itemYear = (item._year || '').toString().toLowerCase();
      const itemMonth = (item.month || '').toLowerCase();
      const itemState = (item.state || '').toLowerCase();
      const itemProduct = (item.product || '').toLowerCase();
      const itemReq = (item.requirement_in_mt_ || '').toString().toLowerCase();
      const itemAvail = (item.availability_in_mt_ || '').toString().toLowerCase();
      const itemId = (item.id || '').toString().toLowerCase();


      const matchesSearchYear = !searchYear || itemYear.includes(searchYear);
      const matchesSearchMonth = !searchMonth || itemMonth.includes(searchMonth);
      const matchesSearchState = !searchState || itemState.includes(searchState);
      const matchesSearchProduct = !searchProduct || itemProduct.includes(searchProduct);
      const matchesSearchReq = !searchReq || itemReq.includes(searchReq);
      const matchesSearchAvail = !searchAvail || itemAvail.includes(searchAvail);
      const matchesSearchId = !searchId || itemId.includes(searchId);


      return matchesYear && matchesMonth && matchesState &&
             matchesSearchYear && matchesSearchMonth && matchesSearchState &&
             matchesSearchProduct && matchesSearchReq && matchesSearchAvail && matchesSearchId;
    });
    return result;
  }, [data, filterYear, filterMonth, filterState, searchTerms]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerms(prev => ({ ...prev, [name]: value }));
  };

  const aggregatedProducts = useMemo(() => {
    const productMap = new Map();
    filteredData.forEach(item => {
      const { product, requirement_in_mt_, availability_in_mt_ } = item;
      if (!product || requirement_in_mt_ === undefined || availability_in_mt_ === undefined) {
        return;
      }
      const current = productMap.get(product) || {
        product: product,
        requirement: 0,
        availability: 0,
        netBalance: 0,
      };
      current.requirement += parseFloat(requirement_in_mt_) || 0;
      current.availability += parseFloat(availability_in_mt_) || 0;
      current.netBalance = current.availability - current.requirement;
      productMap.set(product, current);
    });

    const sortedResult = Array.from(productMap.values()).sort((a, b) => {
      if (aggregatedSortConfig.direction === 'ascending') {
        if (typeof a[aggregatedSortConfig.key] === 'string') return a[aggregatedSortConfig.key].localeCompare(b[aggregatedSortConfig.key]);
        return a[aggregatedSortConfig.key] - b[aggregatedSortConfig.key];
      } else {
        if (typeof a[aggregatedSortConfig.key] === 'string') return b[aggregatedSortConfig.key].localeCompare(a[aggregatedSortConfig.key]);
        return b[aggregatedSortConfig.key] - a[aggregatedSortConfig.key];
      }
    });
    return sortedResult;
  }, [filteredData, aggregatedSortConfig]);

  const sortedRawData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (rawDataSortConfig.key) {
      sortableItems.sort((a, b) => {
        const valA = a[rawDataSortConfig.key] || '';
        const valB = b[rawDataSortConfig.key] || '';

        if (typeof valA === 'string' && typeof valB === 'string') {
          return rawDataSortConfig.direction === 'ascending'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return rawDataSortConfig.direction === 'ascending'
            ? (parseFloat(valA) || 0) - (parseFloat(valB) || 0)
            : (parseFloat(valB) || 0) - (parseFloat(valA) || 0);
        }
      });
    }
    return sortableItems;
  }, [filteredData, rawDataSortConfig]);

  const requestSort = (key, type = 'aggregated') => {
    let direction = 'ascending';
    let currentSortConfig;
    let setSortConfig;

    if (type === 'aggregated') {
      currentSortConfig = aggregatedSortConfig;
      setSortConfig = setAggregatedSortConfig;
    } else {
      currentSortConfig = rawDataSortConfig;
      setSortConfig = setRawDataSortConfig;
    }

    if (currentSortConfig.key === key && currentSortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key, type = 'aggregated') => {
    const config = type === 'aggregated' ? aggregatedSortConfig : rawDataSortConfig;
    if (config.key !== key) return null;
    return config.direction === 'ascending' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  return (
    <div className="flex-grow p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 px-4">Product Details</h2>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md mb-6 mx-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Filter Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="year-filter" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Year</label>
            <select
              id="year-filter"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-blue-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            >
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="month-filter" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Month</label>
            <select
              id="month-filter"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-blue-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            >
              {uniqueMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="state-filter" className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">State</label>
            <select
              id="state-filter"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 p-2.5 rounded-md bg-blue-50 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            >
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md mx-4 mb-6 overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Aggregated Product Overview</h3>
        {aggregatedProducts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center py-8">
            No aggregated data available for the selected filters. Please check your filters or the data in `result.js`.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-green-600 dark:bg-green-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('product', 'aggregated')}>
                  Product {getSortIcon('product', 'aggregated')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('requirement', 'aggregated')}>
                  Total Requirement (MT) {getSortIcon('requirement', 'aggregated')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('availability', 'aggregated')}>
                  Total Availability (MT) {getSortIcon('availability', 'aggregated')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('netBalance', 'aggregated')}>
                  Net Balance (MT) {getSortIcon('netBalance', 'aggregated')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {aggregatedProducts.map((product, index) => (
                <tr key={product.product} className={`bg-gray-<span class="math-inline">\{index % 2 \=\=\= 0 ? '100' \: '200'\} dark\:bg\-gray\-</span>{index % 2 === 0 ? '700' : '800'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{product.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{product.requirement.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{product.availability.toLocaleString()}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${product.netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {product.netBalance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md mx-4 overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Raw Data Entries</h3>
        {sortedRawData.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center py-8">
            No raw data entries available for the selected filters. This might indicate issues with your `result.js` data or filter criteria.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-green-600 dark:bg-green-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('_year', 'raw')}>
                  Year {getSortIcon('_year', 'raw')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('month', 'raw')}>
                  Month {getSortIcon('month', 'raw')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('state', 'raw')}>
                  State {getSortIcon('state', 'raw')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('product', 'raw')}>
                  Product {getSortIcon('product', 'raw')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('requirement_in_mt_', 'raw')}>
                  Requirement (MT) {getSortIcon('requirement_in_mt_', 'raw')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('availability_in_mt_', 'raw')}>
                  Availability (MT) {getSortIcon('availability_in_mt_', 'raw')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer" onClick={() => requestSort('id', 'raw')}>
                  ID {getSortIcon('id', 'raw')}
                </th>
              </tr>
              <tr className="bg-green-700 dark:bg-green-800">
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="_year"
                    placeholder="Search Year"
                    value={searchTerms._year}
                    onChange={handleSearchChange}
                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    aria-label="Search by Year"
                  />
                </th>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="month"
                    placeholder="Search Month"
                    value={searchTerms.month}
                    onChange={handleSearchChange}
                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    aria-label="Search by Month"
                  />
                </th>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="state"
                    placeholder="Search State"
                    value={searchTerms.state}
                    onChange={handleSearchChange}
                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    aria-label="Search by State"
                  />
                </th>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="product"
                    placeholder="Search Product"
                    value={searchTerms.product}
                    onChange={handleSearchChange}
                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    aria-label="Search by Product"
                  />
                </th>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="requirement_in_mt_"
                    placeholder="Search Req."
                    value={searchTerms.requirement_in_mt_}
                    onChange={handleSearchChange}
                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    aria-label="Search by Requirement"
                  />
                </th>
                <th className="px-6 py-2">
                  <input
                    type="text"
                    name="availability_in_mt_"
                    placeholder="Search Avail."
                    value={searchTerms.availability_in_mt_}
                    onChange={handleSearchChange}
                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    aria-label="Search by Availability"
                  />
                </th>
                <th scope="col" className="px-6 py-2">
                  <input
                    type="text"
                    name="id"
                    placeholder="Search ID"
                    value={searchTerms.id}
                    onChange={handleSearchChange}
                    className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                    aria-label="Search by ID"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {sortedRawData.map((item, index) => (
                <tr key={item.id || index} className={`bg-gray-<span class="math-inline">\{index % 2 \=\=\= 0 ? '100' \: '200'\} dark\:bg\-gray\-</span>{index % 2 === 0 ? '700' : '800'} hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-150`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item._year || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.month || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.state || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{item.product || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parseFloat(item.requirement_in_mt_).toLocaleString() || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{parseFloat(item.availability_in_mt_).toLocaleString() || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.id || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Product;