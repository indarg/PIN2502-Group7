from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.decorators import api_view

from app import settings
from common.helpers.api_responses import api_response_success
from common.service.impl.storage_service_impl import StorageServiceImpl
from user_management.decorators.valid_role import valid_role


@api_view(['POST'])
@valid_role("Admin")
def uploaded_file_controller(request):
    """
    Upload file controller.
    """
    overwrite = request.data.get('overwrite', False)
    overwrite = True if overwrite == 'true' else False
    uploaded_file = request.FILES['file']
    title = request.POST.get('title', 'uploaded_image')
    media_type = request.POST.get('media_type', 'image')
    storage_file_service = StorageServiceImpl()
    response = storage_file_service.upload_file_to_directory_v2(uploaded_file, title, media_type,
                                                             overwrite) if settings.ENV == 'DEVELOPMENT' else storage_file_service.upload_file_v2(
        uploaded_file, title, media_type, overwrite)
    return api_response_success(
        "¡Archivo subido correctamente!", response, status.HTTP_200_OK
    )
