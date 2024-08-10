import { useState, useEffect } from 'react';
import TopGainersLosersTable from '../components/TopGainersLosersTable';
import { fetchTopGainersLosers } from '../lib/api';

export default function TopGainersLosers() {
  const [topGainersLosersData, setTopGainersLosersData] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchTopGainersLosers();
        setTopGainersLosersData(data);
      } catch (error) {
        console.error('Error fetching top gainers and losers data:', error);
      }
    }

    getData();
  }, []);

  return (
    <div>
      <h1>Top Gainers and Losers</h1>
      <h3>Stocks with the highest gains and losses in value over the last 24 hours.</h3>
      <TopGainersLosersTable data={topGainersLosersData} />
    </div>
  );
}
