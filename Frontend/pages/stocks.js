import { useState, useEffect } from 'react';
import StockTable from '../components/StockTable';
import { fetchStockData } from '../lib/api';

export default function Stocks() {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchStockData();
        setStockData(data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    }

    getData();
  }, []);

  return (
    <div>
      <h1>Stock Data</h1>
      <h3>All historical stock data</h3>
      <StockTable data={stockData} />
    </div>
  );
}
