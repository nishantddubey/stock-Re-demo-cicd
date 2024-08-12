import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TopGainersLosersTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  // Dynamically extract columns from the first data object
  const columns = Object.keys(data[0]);

  const getRowStyle = (entry) => {
    return entry.gainers_or_losers === 'Gainers' ? { color: 'green' } : { color: 'red' };
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Top Gainers and Losers', 20, 10);

    const tableRows = data.map(entry => columns.map(column => entry[column]));

    doc.autoTable({
      head: [columns],
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
            {columns.map((column) => (
              <th key={column}>
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} style={getRowStyle(entry)}>
              {columns.map((column) => (
                <td key={column}>{entry[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopGainersLosersTable;
