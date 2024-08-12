import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PriceChangePercentagesTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically extract columns from the first data object
  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      columns.some(column =>
        item[column]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, columns]);

  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    if (sortConfig.key) {
      sortedArray.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
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

    const tableRows = sortedData.map(item => columns.map(column => item[column]));

    doc.autoTable({
      head: [columns],
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
            {columns.map((column) => (
              <th key={column} onClick={() => handleSort(column)}>
                {column.charAt(0).toUpperCase() + column.slice(1)} {sortConfig.key === column ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{item[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriceChangePercentagesTable;
