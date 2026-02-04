"""Request object to create an analysis contract"""
from rest_framework import serializers


class MediaFileSerializer(serializers.Serializer):
    id = serializers.IntegerField(allow_null=True),
    title = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False)
    file_url = serializers.CharField(required=False)
    media_type = serializers.ChoiceField(choices=[
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('document', 'Document'),
        ('other', 'Other')
    ], required=False)
    file_size = serializers.FloatField(required=False, allow_null=True)
    file_format = serializers.CharField(max_length=50, required=False, allow_null=True)