"""Request object to create an analysis contract"""
from rest_framework import serializers

from motor_insight.contract.update_order import UpdateOrderIn


class UpdateOrderYoutubeVideoIn(serializers.Serializer):
    videos=serializers.ListField(child=UpdateOrderIn())
