// Import the Navbar component
import Navbar from './Navbar';
// Import styles from the CSS module
import styles from './Layout.module.css';

// Define the Layout component, which accepts children as a prop
const Layout = ({ children }) => {
  return (
    <div className={styles.container}> {/* Apply container styles */}
      {/* Render the Navbar component */}
      <Navbar />
      {/* Main content area where children components will be rendered */}
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

// Export the Layout component as the default export
export default Layout;
