import axios from 'axios';

const BASE_URL = 'http://192.168.49.2:30001/api';
// const BASE_URL = 'http://localhost:8000/api';


// Fetch the CSRF token
export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/csrf-token/`);
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};

// Handle login requests
export const login = async (username, password, csrfToken) => {
    try {
        const response = await axios.post(`${BASE_URL}/login/`, {
            username,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

// Handle registration requests
export const register = async (username, password, confirmPassword, csrfToken) => {
    try {
        const response = await axios.post(`${BASE_URL}/register/`, {
            username,
            password,
            confirm_password: confirmPassword,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

// Fetch stock data
export const fetchStockData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/stock-data/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        throw error;
    }
};

// Fetch daily closing price data
export const fetchDailyClosingPrice = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/daily-closing-price/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching daily closing price data:', error);
        throw error;
    }
};

// Fetch price change percentage data
export const fetchPriceChangePercentage = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/price-change-percentage/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching price change percentage data:', error);
        throw error;
    }
};

// Fetch top gainers and losers data
export const fetchTopGainersLosers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/top-gainers-losers/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching top gainers and losers data:', error);
        throw error;
    }
};

// Fetch today's data
export const fetchTodaysData = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/todays-data/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching today\'s data:', error);
        throw error;
    }
};


