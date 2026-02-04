from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions

from motor_insight.service.impl.news_service_impl import NewsServiceImpl


@api_view(["GET"])
def get_news_by_id_controller(request, id):
    """
    return NewsTO by id.
    """
    news_service = NewsServiceImpl()
    return api_response_success(
        "Noticia encontrada correctamente",
         news_service.get_all(id=id, is_deleted=False, published=True)[0],
        status.HTTP_200_OK,
    )
