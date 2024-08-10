from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import DailyClosingPrice, PriceChangePercentage, TopGainersLosers, Stock, TodaysData
from .serializers import DailyClosingPriceSerializer, PriceChangePercentageSerializer, TopGainersLosersSerializer, StockSerializer, TodaysDataSerializer
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from rest_framework import status
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from prometheus_client import Gauge, generate_latest
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

# API view to retrieve all Daily Closing Price records
@api_view(['GET'])
def daily_closing_price(request):
    data = DailyClosingPrice.objects.all()  # Query all DailyClosingPrice records
    serializer = DailyClosingPriceSerializer(data, many=True)  # Serialize the data
    return Response(serializer.data)  # Return serialized data as JSON response

# API view to retrieve all Price Change Percentage records
@api_view(['GET'])
def price_change_percentage(request):
    data = PriceChangePercentage.objects.all()  # Query all PriceChangePercentage records
    serializer = PriceChangePercentageSerializer(data, many=True)  # Serialize the data
    return Response(serializer.data)  # Return serialized data as JSON response

# API view to retrieve all Top Gainers and Losers records
@api_view(['GET'])
def top_gainers_losers(request):
    data = TopGainersLosers.objects.all()  # Query all TopGainersLosers records
    serializer = TopGainersLosersSerializer(data, many=True)  # Serialize the data
    return Response(serializer.data)  # Return serialized data as JSON response

# API view to retrieve all Stock records
@api_view(['GET'])
def stock_data(request):
    data = Stock.objects.all()  # Query all Stock records
    serializer = StockSerializer(data, many=True)  # Serialize the data
    return Response(serializer.data)  # Return serialized data as JSON response

# API view to retrieve all Today's Data records
@api_view(['GET'])
def todays_data(request):
    data = TodaysData.objects.all()  # Query all TodaysData records
    serializer = TodaysDataSerializer(data, many=True)  # Serialize the data
    return Response(serializer.data)  # Return serialized data as JSON response

# View to generate and return a CSRF token
def csrf_token_view(request):
    csrf_token = get_token(request)  # Generate a CSRF token
    return JsonResponse({'csrfToken': csrf_token})  # Return the token as JSON response

# API view for user login
@api_view(['POST'])
def custom_login(request):
    username = request.data.get('username')  # Get username from request data
    password = request.data.get('password')  # Get password from request data
    
    user = authenticate(username=username, password=password)  # Authenticate user
    if user is not None:
        login(request, user)  # Log in the user
        return JsonResponse({'message': 'Login successful'}, status=status.HTTP_200_OK)  # Return success message
    return JsonResponse({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)  # Return error message

# API view for user registration
@api_view(['POST'])
def register(request):
    username = request.data.get('username')  # Get username from request data
    password = request.data.get('password')  # Get password from request data
    confirm_password = request.data.get('confirm_password')  # Get confirm_password from request data

    if password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)  # Return error if passwords do not match

    try:
        validate_password(password)  # Validate the password
    except ValidationError as e:
        return Response({'error': e.messages}, status=status.HTTP_400_BAD_REQUEST)  # Return validation errors

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)  # Return error if username already exists

    user = User.objects.create_user(username=username, password=password)  # Create new user
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)  # Return success message

# Define Prometheus metrics
stock_count_gauge = Gauge('stock_count', 'Number of stock records')
daily_closing_price_gauge = Gauge('daily_closing_price', 'Daily closing price', ['ticker', 'date'])
price_change_percentage_gauge = Gauge('price_change_percentage', 'Percentage change in stock prices', ['ticker', 'change_period'])
top_gainers_losers_gauge = Gauge('top_gainers_losers', 'Top gainers and losers', ['ticker', 'gainers_or_losers'])
todays_data_gauge = Gauge('todays_data', 'Today\'s data', ['ticker', 'metric'])

# View to expose metrics for Prometheus
@csrf_exempt
def metrics_view(request):
    # Update stock count metric
    stock_count = Stock.objects.count()
    stock_count_gauge.set(stock_count)

    # Update daily closing price metrics
    daily_closing_prices = DailyClosingPrice.objects.all()
    for record in daily_closing_prices:
        daily_closing_price_gauge.labels(ticker=record.ticker, date=str(record.date)).set(record.close)

    # Update price change percentage metrics
    price_changes = PriceChangePercentage.objects.all()
    for price_change in price_changes:
        price_change_percentage_gauge.labels(
            ticker=price_change.ticker,
            change_period=price_change.change_period
        ).set(price_change.percentage_change)

    # Update top gainers and losers metrics
    top_gainers_losers = TopGainersLosers.objects.all()
    for record in top_gainers_losers:
        top_gainers_losers_gauge.labels(
            ticker=record.ticker,
            gainers_or_losers=record.gainers_or_losers
        ).set(record.percentage_change)

    # Update today's data metrics
    todays_data = TodaysData.objects.all()
    for record in todays_data:
        todays_data_gauge.labels(ticker=record.ticker, metric='open').set(record.open)
        todays_data_gauge.labels(ticker=record.ticker, metric='high').set(record.high)
        todays_data_gauge.labels(ticker=record.ticker, metric='low').set(record.low)
        todays_data_gauge.labels(ticker=record.ticker, metric='close').set(record.close)
        todays_data_gauge.labels(ticker=record.ticker, metric='volume').set(record.volume)

    # Generate the metrics in Prometheus format
    return HttpResponse(generate_latest(), content_type='text/plain; version=0.0.4; charset=utf-8')
