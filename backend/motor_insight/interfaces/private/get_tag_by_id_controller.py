from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from motor_insight.service.impl.tag_service_impl import TagServiceImpl


@api_view(["GET"])
def get_tag_by_id_controller(request, id):
    """
    return TagTO by id.
    """
    tag_service = TagServiceImpl()
    return api_response_success(
        "Etiqueta encontrada correctamente",
        tag_service.get_by_id(id),
        status.HTTP_200_OK,
    )
