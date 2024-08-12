import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TodaysDataTable = ({ data }) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dayName = yesterday.toLocaleDateString('en-US', { weekday: 'long' });

  // Dynamically extract columns from the first data object
  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Today's Data (${dayName})`, 20, 10);

    const tableRows = data.map(item => columns.map(column => item[column]));

    doc.autoTable({
      head: [columns],
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
            {columns.map((column) => (
              <th key={column}>
                {column.charAt(0).toUpperCase() + column.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
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

export default TodaysDataTable;
