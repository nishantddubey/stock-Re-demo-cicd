from django.core.management.base import BaseCommand
import yfinance as yf
from django.db import connection
from datetime import datetime

class Command(BaseCommand):
    help = 'Fetch stock data and store it in the database'

    def handle(self, *args, **kwargs):
        # List of stock tickers to fetch data for
        tickers = [
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
            'META', 'NVDA', 'NFLX', 'ADBE', 'INTC',
            'PYPL', 'CSCO', 'PEP', 'AVGO', 'COST',
            'TM', 'NKE', 'V', 'MA', 'JPM'
        ]

        # Function to fetch stock data using yfinance
        def fetch_stock_data(tickers):
            stock_data = {}
            for ticker in tickers:
                # Create a Ticker object for each ticker
                stock = yf.Ticker(ticker)
                # Fetch historical data for the past day
                data = stock.history(period="1d", interval="1d")  
                stock_data[ticker] = data
            return stock_data

        # Function to create the stock data table if it doesn't exist
        def create_stock_data_table(cursor):
            create_table_query = """
            CREATE TABLE IF NOT EXISTS stocks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ticker VARCHAR(10),
                date DATETIME,
                open FLOAT,
                high FLOAT,
                low FLOAT,
                close FLOAT,
                volume BIGINT
            )
            """
            try:
                # Execute the table creation query
                cursor.execute(create_table_query)
            except Exception as err:
                # Print an error message if table creation fails
                self.stderr.write(f"Failed creating table: {err}")
                return False
            return True

        # Function to insert or update stock data in the database
        def insert_stock_data(cursor, stock_data):
            insert_query = """
            INSERT INTO stocks (ticker, date, open, high, low, close, volume)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            delete_query = "DELETE FROM stocks WHERE date = %s AND ticker = %s"

            for ticker, data in stock_data.items():
                for date, row in data.iterrows():
                    # Delete existing data for the same date and ticker
                    cursor.execute(delete_query, (date, ticker))

                    # Insert new data
                    cursor.execute(insert_query, (
                        ticker,
                        date,
                        row['Open'],
                        row['High'],
                        row['Low'],
                        row['Close'],
                        row['Volume']
                    ))

        # Fetch stock data for the specified tickers
        stock_data = fetch_stock_data(tickers)

        # Use Django's database connection to interact with the database
        with connection.cursor() as cursor:
            # Create the stock data table if it doesn't exist
            if create_stock_data_table(cursor):
                # Insert or update the stock data in the database
                insert_stock_data(cursor, stock_data)
                # Commit the transaction to save changes to the database
                connection.commit()
