import '../styles/globals.css';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../lib/auth';
import { fetchCsrfToken } from '../lib/api';

function MyApp({ Component, pageProps }) {
  const [csrfToken, setCsrfToken] = useState('');
  const router = useRouter();
  const isAuthPage = router.pathname === '/login' || router.pathname === '/register';

  useEffect(() => {
    const getTokenAndRedirect = async () => {
      try {
        const token = await fetchCsrfToken();
        setCsrfToken(token);
        window.csrfToken = token;
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }

      if (!isAuthenticated() && !isAuthPage) {
        router.push('/login');
      }
    };

    getTokenAndRedirect();
  }, [router, isAuthPage]);

  return isAuthPage ? (
    <Component {...pageProps} csrfToken={csrfToken} />
  ) : (
    <Layout>
      <Component {...pageProps} csrfToken={csrfToken} />
    </Layout>
  );
}

export default MyApp;
