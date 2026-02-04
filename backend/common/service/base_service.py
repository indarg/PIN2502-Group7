from abc import ABC, abstractmethod

from common.helpers.query_options import QueryOptions


class BaseService(ABC):
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
    def delete_by_id(self, id):
        """
        Delete a record by ID.
        """

    @abstractmethod
    def soft_delete_by_id(self, id):
        """
        Send a record to trash by ID.
        """

    @abstractmethod
    def restore_by_id(self, id):
        """
        Restore record to trash by ID.
        """

    @abstractmethod
    def create(self, data):
        """
        Add a new record to the database.
        """

    @abstractmethod
    def update(self, id, data):
        """
        Add a new record to the database.
        """
