from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions

from motor_insight.service.impl.tag_service_impl import TagServiceImpl


@api_view(["GET"])
def get_tags_crm_controller(request):
    """
    List all tag and return them in TagTO format.
    """
    tag_service = TagServiceImpl()
    query_options = QueryOptions.from_request(request)

    return api_response_success(
        "Etiquetas encontradas",
        tag_service.get_all_by_query_options(query_options),
        status.HTTP_200_OK,
    )
