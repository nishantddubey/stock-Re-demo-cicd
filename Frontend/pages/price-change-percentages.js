import { useState, useEffect } from 'react';
import PriceChangePercentageTable from '../components/PriceChangePercentageTable';
import { fetchPriceChangePercentage } from '../lib/api';

export default function PriceChangePercentages() {
  const [priceChangePercentageData, setPriceChangePercentageData] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchPriceChangePercentage();
        setPriceChangePercentageData(data);
      } catch (error) {
        console.error('Error fetching price change percentage data:', error);
      }
    }

    getData();
  }, []);

  return (
    <div>
      <h1>Price Change Percentages</h1>
      <h3>The percentage change in the stock's price over the last 24 hours/30 days/1 year.</h3>
      <PriceChangePercentageTable data={priceChangePercentageData} />
    </div>
  );
}
