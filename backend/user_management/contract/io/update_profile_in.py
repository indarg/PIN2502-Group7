"""Request object to create an analysis contract"""
from rest_framework import serializers
from common.serializer.media_file_serializer import MediaFileSerializer

class UpdateProfileIn(serializers.Serializer):
    first_name = serializers.CharField(max_length=120)
    last_name = serializers.CharField(max_length=120)
    profile_image = MediaFileSerializer(required=False)
