import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TopGainersLosersTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const getRowStyle = (gainers_or_losers) => {
    return gainers_or_losers === 'Gainers' ? { color: 'green' } : { color: 'red' };
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Top Gainers and Losers', 20, 10);

    const tableColumn = ["Ticker", "Date", "Gainers or Losers", "Percentage Change"];
    const tableRows = [];

    data.forEach(entry => {
      const entryData = [
        entry.ticker,
        entry.date,
        entry.gainers_or_losers,
        entry.percentage_change,
      ];
      tableRows.push(entryData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('top_gainers_losers.pdf');
  };

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
            <th>Gainers or Losers</th>
            <th>Percentage Change</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={`${entry.ticker}-${entry.date}-${entry.gainers_or_losers}`} style={getRowStyle(entry.gainers_or_losers)}>
              <td>{entry.ticker}</td>
              <td>{entry.date}</td>
              <td>{entry.gainers_or_losers}</td>
              <td>{entry.percentage_change}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopGainersLosersTable;
