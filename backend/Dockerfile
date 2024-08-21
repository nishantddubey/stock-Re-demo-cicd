# Stage 1: Build the dependencies
FROM python:3.10-alpine as builder

# Set the working directory
WORKDIR /app

# Install system dependencies needed for Python packages
RUN apk update \
    && apk add --no-cache \
        gcc \
        musl-dev \
        mariadb-dev \
        pkgconfig \
    && pip install --upgrade pip

# Copy the requirements file into the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --prefix=/install -r requirements.txt

# Stage 2: Final image
FROM python:3.10-alpine

# Set the working directory
WORKDIR /app

# Install dcron and any additional dependencies
RUN apk update \
    && apk add --no-cache \
        dcron \
        mariadb-dev \
    && pip install --upgrade pip

# Copy the installed Python packages from the builder stage
COPY --from=builder /install /usr/local

# Copy the rest of the application code into the container
COPY . .

# Add the cron job for fetching and processing stock data every 2 minutes
RUN echo "*/2 * * * * cd /app && /usr/local/bin/python manage.py makemigrations && /usr/local/bin/python manage.py migrate && /usr/local/bin/python manage.py fetch_stock_data && sleep 30 && /usr/local/bin/python manage.py process_stock_data >> /var/log/cron.log 2>&1" > /etc/crontabs/stock_data_cron \
    && chmod 0644 /etc/crontabs/stock_data_cron

# Give execution rights on the cron job
RUN chmod +x /etc/crontabs/stock_data_cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

RUN rm -rf api/migrations/0*.py

# Start the dcron service, create migrations, apply migrations, and start the Django server
CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && crond && exec python manage.py runserver 0.0.0.0:8000"]
