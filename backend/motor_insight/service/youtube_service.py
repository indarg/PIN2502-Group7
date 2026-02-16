"""This module contains the tag service"""
from abc import ABC, abstractmethod

from common.service.base_service import BaseService
from motor_insight.contract.update_order_youtube_video_in import UpdateOrderYoutubeVideoIn


class YouTubeVideoService(BaseService, ABC):
    """YouTubeVideo service"""

    @abstractmethod
    def update_order(self,data:UpdateOrderYoutubeVideoIn):
        pass