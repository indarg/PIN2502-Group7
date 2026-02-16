"""This module contains the news service"""
from abc import ABC, abstractmethod

from common.helpers.query_options import QueryOptions
from common.repository.base_repository import BaseRepository
from common.service.base_service import BaseService
from motor_insight.contract.create_news_in import CreateNewsIn


class NewsService(BaseService, ABC):
    """News service"""

    def get_filtered_and_ordered(self, search_value=None):
        """Get newsTO global search"""
