"""This module contains the implementation of tag repository"""
from abc import ABC, abstractmethod

from common.repository.base_repository import BaseRepository
from motor_insight.contract.to.tag_to import TagTO


class TagRepository(BaseRepository, ABC):
    """Tag repository"""


    @abstractmethod
    def get_tags_by_filters(self, **kwargs) -> list[TagTO]:
        """
           Get tag based on dynamic filters.
           Accepts any combination of filter arguments.
           """
