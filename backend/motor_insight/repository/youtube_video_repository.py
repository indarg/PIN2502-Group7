"""This module contains the implementation of YouTubeVideo repository"""
from abc import ABC, abstractmethod
from typing import Dict

from common.repository.base_repository import BaseRepository
from motor_insight.contract.to.youtube_video_to import YouTubeVideoTO


class YouTubeVideoRepository(BaseRepository, ABC):
    """YouTubeVideo repository"""


    @abstractmethod
    def get_youtube_videos_by_filters(self, **kwargs) -> list[YouTubeVideoTO]:
        """
           Get YouTubeVideo based on dynamic filters.
           Accepts any combination of filter arguments.
           """

    @abstractmethod
    def update_order(self, data: Dict[str, int]):
        pass

    @abstractmethod
    def update_order_after_update_or_delete(self, start_order: int):
        pass
