"""This module contains the implementation of news repository"""
from abc import ABC, abstractmethod

from common.repository.base_repository import BaseRepository
from motor_insight.contract.to.news_to import NewsTO


class NewsRepository(BaseRepository, ABC):
    """News repository"""

    @abstractmethod
    def get_news_by_filters(self, **kwargs) -> list[NewsTO]:
        """
           Get news based on dynamic filters.
           Accepts any combination of filter arguments.
           """

    def get_filtered_and_ordered(self, search_value: str | None = None) -> list[NewsTO]:
        """
        Get news based on dynamic filters.
        :param search_value:
        :return:
        """
