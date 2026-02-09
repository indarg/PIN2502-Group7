"""Request object to create a news contract"""
from rest_framework import serializers

from common.serializer.media_file_serializer import MediaFileSerializer
from motor_insight.serializer.column_serializer import ColumnSerializer
from motor_insight.serializer.tag_serializer import TagSerializer


class CreateNewsIn(serializers.Serializer):
    published = serializers.BooleanField(default=False)
    draft = serializers.BooleanField(default=False)
    headline = serializers.CharField(max_length=100, allow_blank=True)
    lead = serializers.CharField(allow_blank=True)
    description = serializers.CharField(allow_blank=True)
    body = serializers.CharField(allow_blank=True)
    closure = serializers.CharField(allow_blank=True)
    columns = serializers.ListField(child=ColumnSerializer(), allow_empty=True, required=False)
    main_image = MediaFileSerializer()
    videos = serializers.ListField(child=MediaFileSerializer(), allow_empty=True, required=False)
    images = serializers.ListField(child=MediaFileSerializer(), allow_empty=True, required=False)
    tags = serializers.ListField(child=TagSerializer(), allow_empty=True, required=False)
