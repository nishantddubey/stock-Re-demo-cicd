import Link from 'next/link'; // Import the Link component from Next.js for navigation
import { useRouter } from 'next/router'; // Import the useRouter hook from Next.js
import styles from './Navbar.module.css'; // Import styles from the CSS module
import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from React

const Navbar = () => {
  const router = useRouter(); // Initialize the router object
  const [username, setUsername] = useState(''); // Initialize the username state

  useEffect(() => {
    // Retrieve the username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername); // Set the username state
    }
  }, []);

  const handleLogout = () => {
    // Remove the auth token and username from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    // Redirect to login page
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}> {/* Apply navbar styles */}
      <ul className={styles.navList}> {/* Apply navList styles */}
        <li><Link href="/">Home</Link></li>
        <li><Link href="/daily-closing-prices">Daily Closing Prices</Link></li>
        <li><Link href="/price-change-percentages">Price Change Percentages</Link></li>
        <li><Link href="/top-gainers-losers">Top Gainers/Losers</Link></li>
        <li><Link href="/stocks">Stocks Data History</Link></li>
        <li>
          <a
            href="http://192.168.49.2:31001/dashboards/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Dashboard
          </a>
        </li>
      </ul>
      <div className={styles.userInfo}> {/* Apply userInfo styles */}
        {username && (
          <span className={styles.welcomeMessage}> {/* Apply welcomeMessage styles */}
            Welcome {username},
          </span>
        )}
        <button onClick={handleLogout} className={styles.logoutButton}> {/* Apply logoutButton styles */}
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
