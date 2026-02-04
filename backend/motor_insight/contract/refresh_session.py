"""Request object to create an analysis contract"""
from rest_framework import serializers


class RefreshTokenIn(serializers.Serializer):
    refresh_token = serializers.CharField()
    email: str = serializers.EmailField()
