import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TodaysDataTable = ({ data }) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dayName = yesterday.toLocaleDateString('en-US', { weekday: 'long' });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Today's Data (${dayName})`, 20, 10);

    const tableColumn = ["Ticker", "Date", "Open", "High", "Low", "Close", "Volume"];
    const tableRows = [];

    data.forEach(item => {
      const itemData = [
        item.ticker,
        item.date,
        item.open,
        item.high,
        item.low,
        item.close,
        item.volume,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('todays_data.pdf');
  };

  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
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
            <th>Ticker</th>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
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

export default TodaysDataTable;
