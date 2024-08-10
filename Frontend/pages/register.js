import { useState, useEffect } from 'react'; // Add this import statement
import Router from 'next/router';
import styles from '../styles/Register.module.css'; // Import the CSS module for styling
import { fetchCsrfToken, register } from '../lib/api'; // Import API functions

const Register = ({ csrfToken }) => {
  // State variables to store form input values and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send POST request to the registration API endpoint
      await register(username, password, confirmPassword, csrfTokenFromServer);
      Router.push('/login'); // Redirect to login page on successful registration
    } catch (error) {
      setError('Error during registration');
      console.error('Error during registration:', error); // Log error to the console
    }
  };

  return (
    <div>
      <h2 className={styles.welcome}>
        Register now to start Stock Monitoring with our comprehensive dashboard
      </h2>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Register</h1>
          <form onSubmit={handleSubmit}>
            {/* Input field for username */}
            <div className={styles.label}>
              <span>Username:</span>
              <input
                className={styles.inputField}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {/* Input field for password */}
            <div className={styles.label}>
              <span>Password:</span>
              <input
                className={styles.inputField}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Input field for confirm password */}
            <div className={styles.label}>
              <span>Confirm Password:</span>
              <input
                className={styles.inputField}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {/* Submit button */}
            <button type="submit" className={styles.submitButton}>Register</button>
            {/* Display error message if there is one */}
            {error && <p className={styles.error}>{error}</p>}
          </form>
          {/* Link to the login page */}
          <p className={styles.registerLink}>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
