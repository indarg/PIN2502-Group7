"""This module contains the base repository"""
from abc import abstractmethod, ABC

from common.helpers.query_options import QueryOptions


class BaseRepository(ABC):
    """Base repository"""

    @abstractmethod
    def get_all(self, **kwargs):
        """
        Retrieve all records from the database.
        """

    @abstractmethod
    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs) -> dict:
        """
        Retrieve all records from the database.
        """

    @abstractmethod
    def get_by_id(self, id):
        """
        Retrieve a single record by ID.
        """

    @abstractmethod
    def get_deleted_by_id(self, id):
        """
        Retrieve a single deleted record by ID.
        """

    @abstractmethod
    def delete_by_id(self, id):
        """
        Delete a record by ID.
        """

    @abstractmethod
    def soft_delete_by_id(self, id):
        """
        Set a record as deleted or meant to be delete by ID.
        """

    @abstractmethod
    def restore_by_id(self, id):
        """
        Restore a record that was meant to be delete by ID.
        """

    @abstractmethod
    def create_or_update(self, data, update: bool):
        """
        Add a new record to the database.
        """
