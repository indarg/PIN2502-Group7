from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions

from motor_insight.service.impl.news_service_impl import NewsServiceImpl


@api_view(["DELETE"])
def delete_news_by_id_controller(request, id: int):
    """
    List all news and return them in NewsTO format.
    """
    news_service = NewsServiceImpl()
    return api_response_success(
        "Noticia eliminada correctamente",
        news_service.delete_by_id(id),
        status.HTTP_200_OK,
    )
