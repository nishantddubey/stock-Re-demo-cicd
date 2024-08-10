# Import necessary modules and views
from django.urls import path
from . import views
from .views import csrf_token_view, custom_login, register, metrics_view

# Define the URL patterns
urlpatterns = [
    path('daily-closing-price/', views.daily_closing_price, name='daily_closing_price'),
    # URL pattern for fetching daily closing prices. It maps to the 'daily_closing_price' view.
    
    path('price-change-percentage/', views.price_change_percentage, name='price_change_percentage'),
    # URL pattern for fetching price change percentages. It maps to the 'price_change_percentage' view.
    
    path('top-gainers-losers/', views.top_gainers_losers, name='top_gainers_losers'),
    # URL pattern for fetching top gainers and losers. It maps to the 'top_gainers_losers' view.
    
    path('stock-data/', views.stock_data, name='stock_data'),
    # URL pattern for fetching general stock data. It maps to the 'stock_data' view.
    
    path('todays-data/', views.todays_data, name='todays_data'),
    # URL pattern for fetching today's data. It maps to the 'todays_data' view.
    
    path('csrf-token/', csrf_token_view, name='csrf_token'),
    # URL pattern for retrieving the CSRF token. It maps to the 'csrf_token_view'.
    
    path('login/', custom_login, name='custom_login'),
    # URL pattern for handling user login. It maps to the 'custom_login' view.
    
    path('register/', register, name='register'),
    # URL pattern for handling user registration. It maps to the 'register' view.
    
    path('metrics/', metrics_view, name='metrics'),  # Add this line
    # URL pattern for retrieving metrics. It maps to the 'metrics_view' view.
]
