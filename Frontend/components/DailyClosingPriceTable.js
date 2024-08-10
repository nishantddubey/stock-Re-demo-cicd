import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DailyClosingPricesTable = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = React.useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.close.toString().includes(searchQuery)
    );
  }, [data, searchQuery]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Daily Closing Prices', 20, 10);

    const tableColumn = ["Ticker", "Date", "Closing Price"];
    const tableRows = [];

    filteredData.forEach(item => {
      const itemData = [
        item.ticker,
        item.date,
        item.close,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
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
