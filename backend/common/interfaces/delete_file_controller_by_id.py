from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.decorators import api_view

from app import settings
from common.helpers.api_responses import api_response_success
from common.service.impl.storage_service_impl import StorageServiceImpl
from user_management.decorators.valid_role import valid_role


@api_view(['DELETE'])
@valid_role("Admin")
def delete_file_controller_by_id(request, id):
    """
    Upload file controller.
    """
    storage_file_service = StorageServiceImpl()
    return api_response_success(
        "¡Archivo eliminado correctamente!", storage_file_service.delete_by_id(id), status.HTTP_200_OK
    )
