from django.db import models

# Model for storing basic stock data
class Stock(models.Model):
    ticker = models.CharField(max_length=10)  # Stock ticker symbol (e.g., AAPL)
    date = models.DateField()  # Date of the stock data
    open = models.FloatField()  # Opening price of the stock
    high = models.FloatField()  # Highest price of the stock during the day
    low = models.FloatField()  # Lowest price of the stock during the day
    close = models.FloatField()  # Closing price of the stock
    volume = models.BigIntegerField()  # Trading volume

    class Meta:
        db_table = 'stocks'  # Name of the database table
        indexes = [
            models.Index(fields=['ticker', 'date']),  # Index for faster queries by ticker and date
        ]

    def __str__(self):
        return f"{self.ticker} - {self.date}"  # String representation of the object

# Model for storing daily closing price of stocks
class DailyClosingPrice(models.Model):
    ticker = models.CharField(max_length=10)  # Stock ticker symbol
    date = models.DateField()  # Date of the stock data
    close = models.FloatField()  # Closing price of the stock



    class Meta:
        db_table = 'daily_closing_price'  # Name of the database table
        indexes = [
            models.Index(fields=['ticker', 'date']),  # Index for faster queries by ticker and date
        ]

    def __str__(self):
        return f"{self.ticker} - {self.date} - {self.close}"  # String representation of the object

# Model for storing price change percentages over different periods
class PriceChangePercentage(models.Model):
    ticker = models.CharField(max_length=10)  # Stock ticker symbol
    date = models.DateField()  # Date of the stock data
    change_period = models.CharField(max_length=20)  # Period of price change (e.g., '24_hours')
    percentage_change = models.FloatField()  # Percentage change in price
    class Meta:
        db_table = 'price_change_percentage'  # Name of the database table
        indexes = [
            models.Index(fields=['ticker', 'date', 'change_period']),  # Index for faster queries by ticker, date, and period
        ]

    def __str__(self):
        return f"{self.ticker} - {self.date} - {self.change_period} - {self.percentage_change}"  # String representation of the object

# Model for storing information about the top gainers and losers
class TopGainersLosers(models.Model):
    ticker = models.CharField(max_length=10)  # Stock ticker symbol
    date = models.DateField()  # Date of the stock data
    gainers_or_losers = models.CharField(max_length=10)  # Category ('Gainers' or 'Losers')
    percentage_change = models.FloatField()  # Percentage change in price

    class Meta:
        db_table = 'top_gainers_losers'  # Name of the database table
        indexes = [
            models.Index(fields=['ticker', 'date', 'gainers_or_losers']),  # Index for faster queries by ticker, date, and category
        ]

    def __str__(self):
        return f"{self.ticker} - {self.date} - {self.gainers_or_losers} - {self.percentage_change}"  # String representation of the object

# Model for storing data specific to the current day
class TodaysData(models.Model):
    ticker = models.CharField(max_length=10)  # Stock ticker symbol
    date = models.DateField()  # Date of the stock data
    open = models.FloatField()  # Opening price of the stock
    high = models.FloatField()  # Highest price of the stock during the day
    low = models.FloatField()  # Lowest price of the stock during the day
    close = models.FloatField()  # Closing price of the stock
    volume = models.BigIntegerField()  # Trading volume

    class Meta:
        db_table = 'todays_data'  # Name of the database table
        indexes = [
            models.Index(fields=['ticker', 'date']),  # Index for faster queries by ticker and date
        ]

    def __str__(self):
        return f"{self.ticker} - {self.date} - Open: {self.open}, High: {self.high}, Low: {self.low}, Close: {self.close}, Volume: {self.volume}"  # String representation of the object
