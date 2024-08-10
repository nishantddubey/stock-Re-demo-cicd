import { useState, useEffect } from 'react';
import DailyClosingPricesTable from '../components/DailyClosingPriceTable';
import { fetchDailyClosingPrice } from '../lib/api';

const DailyClosingPrices = () => {
  const [dailyClosingPriceData, setDailyClosingPriceData] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchDailyClosingPrice();
        setDailyClosingPriceData(data);
      } catch (error) {
        console.error('Error fetching daily closing price data:', error);
      }
    }

    getData();
  }, []);

  return (
    <div>
      <h1>Daily Closing Prices</h1>
      <h3>The final price at which a stock is traded at the end of the day.</h3>
      <DailyClosingPricesTable data={dailyClosingPriceData} />
    </div>
  );
}

export default DailyClosingPrices;
