"""Request object to create an analysis contract"""
from rest_framework import serializers


class CreateUpdateYTVideoIn(serializers.Serializer):
    id = serializers.CharField(max_length=110, allow_blank=True)
    title = serializers.CharField(max_length=140, allow_blank=True)
    active = serializers.BooleanField(default=False)
    order = serializers.IntegerField()

    def validate_title(self, value):
        """Custom validation for title"""
        if not value.strip():
            raise serializers.ValidationError("El título no puede estar vacío")
        return value.strip()