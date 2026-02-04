"""Request object to create an analysis contract"""
from rest_framework import serializers

from common.serializer.media_file_serializer import MediaFileSerializer


class ColumnSerializer(serializers.Serializer):
    id = serializers.IntegerField(allow_null=True),
    title = serializers.CharField()
    body = serializers.CharField(allow_blank=True)
    image = MediaFileSerializer()
