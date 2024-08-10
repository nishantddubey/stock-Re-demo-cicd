import React, { useState } from 'react';

const PriceChangePercentagesTable = ({ data }) => {
  // State for sorting configuration with initial values
  const [sortConfig, setSortConfig] = useState({ key: 'ticker', direction: 'ascending' });
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered data based on search query
  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.change_period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.percentage_change.toString().includes(searchQuery)
    );
  }, [data, searchQuery]);

  // Sorted data based on sort configuration
  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    sortedArray.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortedArray;
  }, [filteredData, sortConfig]);

  // Handle sorting logic for table headers
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Render message if no data is available
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div>
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      {/* Table displaying the data */}
      <table>
        <thead>
          <tr>
            {/* Table headers with sorting functionality */}
            <th onClick={() => handleSort('ticker')}>
              Ticker {sortConfig.key === 'ticker' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('date')}>
              Date {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('change_period')}>
              Change Period {sortConfig.key === 'change_period' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('percentage_change')}>
              Percentage Change {sortConfig.key === 'percentage_change' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Displaying sorted and filtered data */}
          {sortedData.map((item) => (
            <tr key={item.id}>
              <td>{item.ticker}</td>
              <td>{item.date}</td>
              <td>{item.change_period}</td>
              <td>{item.percentage_change}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceChangePercentagesTable;
