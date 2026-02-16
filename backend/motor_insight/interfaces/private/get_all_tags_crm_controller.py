from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions

from motor_insight.service.impl.tag_service_impl import TagServiceImpl


@api_view(["GET"])
def get_all_tags_crm_controller(request):
    """
    List all tag and return them in TagTO format.
    """
    tag_service = TagServiceImpl()

    return api_response_success(
        "Etiquetas encontradas",
        tag_service.get_all(),
        status.HTTP_200_OK,
    )
