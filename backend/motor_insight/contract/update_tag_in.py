"""Request object to create an analysis contract"""
from rest_framework import serializers


class UpdateTagIn(serializers.Serializer):
    id = serializers.IntegerField()
    code = serializers.CharField(max_length=50, allow_blank=True)
    name = serializers.CharField(max_length=140, allow_blank=True)
