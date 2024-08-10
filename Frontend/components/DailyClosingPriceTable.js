import React, { useState } from 'react';

// Component for displaying daily closing prices in a table
const DailyClosingPricesTable = ({ data }) => {
  // State for managing the search query
  const [searchQuery, setSearchQuery] = useState('');

  // Memoized computation of filtered data based on search query
  const filteredData = React.useMemo(() => {
    if (!data) return []; // Return empty array if no data

    // Filter data based on whether the ticker, date, or close matches the search query
    return data.filter((item) =>
      item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.close.toString().includes(searchQuery)
    );
  }, [data, searchQuery]); // Dependencies for memoization

  // If no data is available, display a message
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
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query state on input change
        style={{ marginBottom: '10px' }}
      />
      {/* Table to display filtered data */}
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Date</th>
            <th>Closing Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.ticker}</td>
              <td>{item.date}</td>
              <td>{item.close}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyClosingPricesTable;
