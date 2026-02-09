from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions

from motor_insight.service.impl.tag_service_impl import TagServiceImpl


@api_view(["DELETE"])
def delete_tag_by_id_controller(request, id: int):
    """
    List all tag and return them in TagTO format.
    """
    tag_service = TagServiceImpl()
    return api_response_success(
        "Etiqueta eliminada correctamente",
        tag_service.delete_by_id(id),
        status.HTTP_200_OK,
    )
