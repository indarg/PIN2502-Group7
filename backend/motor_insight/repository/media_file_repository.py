"""This module contains the implementation of media_file repository"""
from abc import ABC, abstractmethod

from common.contract.to.media_file_to import MediaFileTO
from common.repository.base_repository import BaseRepository


class MediaFileRepository(BaseRepository, ABC):
    """MediaFile repository"""


    @abstractmethod
    def get_media_file_by_filters(self, **kwargs) -> list[MediaFileTO]:
        """
           Get media_file based on dynamic filters.
           Accepts any combination of filter arguments.
           """
