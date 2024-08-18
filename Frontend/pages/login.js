import { useState, useEffect } from 'react'; // Add this import statement
import Router from 'next/router';
import styles from '../styles/Login.module.css'; // Import the CSS module for styling
import { fetchCsrfToken, login } from '../lib/api'; // Import API functions

const Login = ({ csrfToken }) => {
  // State variables for storing username, password, and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [csrfTokenFromServer, setCsrfTokenFromServer] = useState(csrfToken);

  // Fetch CSRF token when the component mounts
  useEffect(() => {
    async function getCsrfToken() {
      try {
        const token = await fetchCsrfToken();
        setCsrfTokenFromServer(token);
        window.csrfToken = token;
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    }

    if (!csrfToken) {
      getCsrfToken();
    }
  }, [csrfToken]);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send POST request to the login API endpoint
      const data = await login(username, password, csrfTokenFromServer);

      // Store token and redirect on successful login
      localStorage.setItem('authToken', data.token); // Store the token in localStorage
      localStorage.setItem('username', username); // Store the username in localStorage
      Router.push('/'); // Redirect to the home page
    } catch (error) {
      setError('Error during login');
      console.error('Error during login:', error); // Log error to the console
    }
  };

  return (
    <div>
      <h2 className={styles.welcome}>
        Welcome Back! Please log in to access your Stock Monitoring Dashboard.
      </h2>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Login</h1>
          <form onSubmit={handleSubmit}>
            {/* Input field for username */}
            <label className={styles.label}>
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.inputField}
              />
            </label>
            {/* Input field for password */}
            <label className={styles.label}>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputField}
              />
            </label>
            {/* Submit button */}
            <button type="submit" className={styles.submitButton}>Login</button>
            {/* Display error message if there is one */}
            {error && <p className={styles.error}>{error}</p>}
          </form>
          {/* Link to the registration page */}
          <p className={styles.registerLink}>
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
