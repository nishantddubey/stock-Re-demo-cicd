import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PriceChangePercentagesTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'ticker', direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.change_period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.percentage_change.toString().includes(searchQuery)
    );
  }, [data, searchQuery]);

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

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Price Change Percentages', 20, 10);

    const tableColumn = ["Ticker", "Date", "Change Period", "Percentage Change"];
    const tableRows = [];

    sortedData.forEach(item => {
      const itemData = [
        item.ticker,
        item.date,
        item.change_period,
        item.percentage_change,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('price_change_percentages.pdf');
  };

  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', width: '100%', maxWidth: '250px' }}
        />
        <button
          onClick={downloadPDF}
          style={{ padding: '8px 12px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', fontSize: '14px', cursor: 'pointer' }}
        >
          Download PDF
        </button>
      </div>
      <table>
        <thead>
          <tr>
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
