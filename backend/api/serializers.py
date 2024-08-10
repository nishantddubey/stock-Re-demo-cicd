from rest_framework import serializers
from .models import DailyClosingPrice, PriceChangePercentage, TopGainersLosers, Stock, TodaysData

# Serializer for the DailyClosingPrice model
class DailyClosingPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyClosingPrice  # Specifies the model to be serialized
        fields = '__all__'  # Includes all fields of the model in the serialized output

# Serializer for the PriceChangePercentage model
class PriceChangePercentageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceChangePercentage  # Specifies the model to be serialized
        fields = '__all__'  # Includes all fields of the model in the serialized output

# Serializer for the TopGainersLosers model
class TopGainersLosersSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopGainersLosers  # Specifies the model to be serialized
        fields = '__all__'  # Includes all fields of the model in the serialized output

# Serializer for the Stock model
class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock  # Specifies the model to be serialized
        fields = '__all__'  # Includes all fields of the model in the serialized output

# Serializer for the TodaysData model
class TodaysDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodaysData  # Specifies the model to be serialized
        fields = '__all__'  # Includes all fields of the model in the serialized output
