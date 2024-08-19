#!/bin/sh

# Remove old migrations
echo "Removing old migrations..."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete

# Remove old migration files from migration folders
echo "Removing old migration folders..."
find . -path "*/migrations" -type d -empty -delete

# Apply migrations
echo "Applying new migrations..."
python manage.py makemigrations
python manage.py migrate

# Start the cron service
echo "Starting cron service..."
crond

# Start the Django server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
