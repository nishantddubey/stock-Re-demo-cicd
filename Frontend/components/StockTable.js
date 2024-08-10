import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StockTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'ticker', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('');

  const getSortFunction = (key) => {
    switch (key) {
      case 'date':
        return (a, b) => new Date(a[key]) - new Date(b[key]);
      case 'ticker':
        return (a, b) => a[key].localeCompare(b[key]);
      case 'open':
      case 'high':
      case 'low':
      case 'close':
      case 'volume':
        return (a, b) => a[key] - b[key];
      default:
        return (a, b) => a[key].localeCompare(b[key]);
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const sortFunction = getSortFunction(sortConfig.key);
    const comparison = sortFunction(a, b);
    return sortConfig.direction === 'ascending' ? comparison : -comparison;
  });

  const filteredData = sortedData.filter((item) =>
    item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!startDate || new Date(item.date) >= new Date(startDate)) &&
    (!endDate || new Date(item.date) <= new Date(endDate)) &&
    (!selectedTicker || item.ticker === selectedTicker)
  );

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Ticker', 'Date', 'Open', 'High', 'Low', 'Close', 'Volume']],
      body: filteredData.map(item => [
        item.ticker,
        item.date,
        item.open,
        item.high,
        item.low,
        item.close,
        item.volume
      ]),
    });
    doc.save('stock-data.pdf');
  };

  const uniqueTickers = Array.from(new Set(data.map(item => item.ticker)));

  return (
    <div>
      <div className="filter-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by ticker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', width: '100%', maxWidth: '250px' }}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="date-input"
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', marginLeft: '10px', width: '250px' }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="date-input"
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', marginLeft: '10px', width: '250px' }}
          />
          <select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            className="ticker-select"
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', marginLeft: '10px' }}
          >
            <option value="">All Stocks</option>
            {uniqueTickers.map((ticker) => (
              <option key={ticker} value={ticker}>
                {ticker}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleDownloadPDF} className="download-button" style={{ padding: '8px 12px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
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
            <th onClick={() => handleSort('open')}>
              Open {sortConfig.key === 'open' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('high')}>
              High {sortConfig.key === 'high' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('low')}>
              Low {sortConfig.key === 'low' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('close')}>
              Close {sortConfig.key === 'close' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('volume')}>
              Volume {sortConfig.key === 'volume' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.ticker}</td>
              <td>{item.date}</td>
              <td>{item.open}</td>
              <td>{item.high}</td>
              <td>{item.low}</td>
              <td>{item.close}</td>
              <td>{item.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
