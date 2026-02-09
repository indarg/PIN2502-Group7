"""Request object to create an analysis contract"""
from rest_framework import serializers


class UpdateOrderIn(serializers.Serializer):
    id = serializers.CharField(max_length=110, allow_blank=True)
    order = serializers.IntegerField()
