"""This module contains the implementation of media_file repository"""

from common.contract.to.media_file_to import MediaFileTO
from common.helpers.query_options import QueryOptions
from common.models.media_file import MediaFile
from motor_insight.repository.media_file_repository import MediaFileRepository


class MediaFileRepositoryImpl(MediaFileRepository):
    """MediaFile repository"""

    def get_deleted_by_id(self, id):
        pass

    def soft_delete_by_id(self, id):
        pass

    def restore_by_id(self, id):
        pass

    def get_all(self, **kwargs):
        pass

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs) -> dict:
        pass

    def get_by_id(self, id):
        return MediaFileTO.from_model(MediaFile.objects.get(id=id))

    def delete_by_id(self, id):
        try:
            media_file = MediaFile.objects.get(id=id)
            media_file.delete()
            return True
        except MediaFile.DoesNotExist:
            return False

    def create_or_update(self, data, update: bool):
        pass

    def get_media_file_by_filters(self, **kwargs) -> list[MediaFileTO]:
        """
           Get media_file based on dynamic filters.
           Accepts any combination of filter arguments.
           """
        pass
