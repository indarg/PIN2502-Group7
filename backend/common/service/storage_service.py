"""This module contains the news service"""
from abc import ABC, abstractmethod

from common.service.base_service import BaseService


class StorageService(BaseService, ABC):
    """Storage service"""

    @abstractmethod
    def upload_file(self, uploaded_file, title, media_type, overwrite: bool = False):
        """Upload file to s3"""

    @abstractmethod
    def delete_file_from_storage(self, file_path: str) -> bool:
        """
        Delete a file from storage(example: 'uploads/nombre.webp') from s3.
        returns true if exists false is not.
        """
    @abstractmethod
    def delete_file_from_storage_bulk(self, file_paths: list[str]) -> bool:
        """
        Delete a file from storage(example: 'uploads/nombre.webp') from s3.
        returns true if exists false is not.
        """

    @abstractmethod
    def delete_file_from_directory(self, file_path: str) -> bool:
        """ Delete a file from directory """

    @abstractmethod
    def upload_file_to_directory(self, file, title, media_type, overwrite=False):
        """Upload file to directory"""
