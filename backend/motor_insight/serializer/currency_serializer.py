"""Request object to create an analysis contract"""
from rest_framework import serializers

class CurrencySerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    name = serializers.CharField(max_length=30, allow_blank=False)
    code = serializers.CharField(max_length=3,allow_blank=False)
