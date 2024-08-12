import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DailyClosingPricesTable = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically get all the keys (columns) from the first data object
  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      columns.some(column =>
        item[column].toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, columns]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Daily Closing Prices', 20, 10);

    const tableRows = filteredData.map(item => columns.map(column => item[column]));

    doc.autoTable({
      head: [columns],
      body: tableRows,
      startY: 20,
    });

    doc.save('daily_closing_prices.pdf');
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
        <button onClick={downloadPDF} style={{ padding: '8px 12px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', fontSize: '14px', cursor: 'pointer', marginLeft: '10px' }}>
          Download PDF
        </button>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column.charAt(0).toUpperCase() + column.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
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

export default DailyClosingPricesTable;
