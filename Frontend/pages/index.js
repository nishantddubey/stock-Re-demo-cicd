import { useState, useEffect } from 'react';
import TodaysDataTable from '../components/TodaysDataTable';
import { fetchTodaysData } from '../lib/api';

const Home = () => {
  const [todaysData, setTodaysData] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchTodaysData();
        setTodaysData(data);
      } catch (error) {
        console.error('Error fetching today\'s data:', error);
      }
    }

    getData();
  }, []);

  return (
    <div>
      <h1>Welcome to the Stock Monitoring System</h1>
      <h3>Here you can view the latest stock data and other related information updated code .</h3>
      <TodaysDataTable data={todaysData} />
    </div>
  );
}

export default Home;
