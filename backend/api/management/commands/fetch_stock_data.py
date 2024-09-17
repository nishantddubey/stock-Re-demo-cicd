from django.core.management.base import BaseCommand
import yfinance as yf
from django.db import connection

class Command(BaseCommand):
    help = 'Fetch stock data and store it in the database'

    def handle(self, *args, **kwargs):
        tickers = [
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA',
            'META', 'NVDA', 'NFLX', 'ADBE', 'INTC',
            'PYPL', 'CSCO', 'PEP', 'AVGO', 'COST',
            'TM', 'NKE', 'V', 'MA', 'JPM'
        ]

        def fetch_stock_data(tickers):
            stock_data = {}
            for ticker in tickers:
                stock = yf.Ticker(ticker)
                data = stock.history(period="1d", interval="1d")
                stock_data[ticker] = data
            return stock_data

        def create_stock_data_table(cursor):
            create_table_query = """
            CREATE TABLE IF NOT EXISTS stocks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ticker VARCHAR(10),
                date DATETIME,
                open DECIMAL(10, 2),
                high DECIMAL(10, 2),
                low DECIMAL(10, 2),
                close DECIMAL(10, 2),
                volume BIGINT
            )
            """
            try:
                cursor.execute(create_table_query)
            except Exception as err:
                self.stderr.write(f"Failed creating table: {err}")
                return False
            return True

        def insert_stock_data(cursor, stock_data):
            insert_query = """
            INSERT INTO stocks (ticker, date, open, high, low, close, volume)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            delete_query = "DELETE FROM stocks WHERE date = %s AND ticker = %s"

            for ticker, data in stock_data.items():
                for date, row in data.iterrows():
                    open_price = round(row['Open'], 2)
                    high_price = round(row['High'], 2)
                    low_price = round(row['Low'], 2)
                    close_price = round(row['Close'], 2)
                    volume = round(row['Volume'])

                    cursor.execute(delete_query, (date, ticker))
                    cursor.execute(insert_query, (
                        ticker,
                        date,
                        open_price,
                        high_price,
                        low_price,
                        close_price,
                        volume
                    ))

        stock_data = fetch_stock_data(tickers)

        with connection.cursor() as cursor:
            if create_stock_data_table(cursor):
                insert_stock_data(cursor, stock_data)
                connection.commit()
