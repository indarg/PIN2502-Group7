"""Request object to create an analysis contract"""
from rest_framework import serializers


class TagSerializer(serializers.Serializer):
    id = serializers.IntegerField(allow_null=True),
    name = serializers.CharField(max_length=120)
    code = serializers.CharField(max_length=120)

