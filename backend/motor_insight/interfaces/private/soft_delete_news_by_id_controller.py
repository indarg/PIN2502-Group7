from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions

from motor_insight.service.impl.news_service_impl import NewsServiceImpl


@api_view(["PUT"])
def soft_delete_news_by_id_controller(request, id: int):
    """
    Sends a news record to the recycle trash
    """
    news_service = NewsServiceImpl()
    return api_response_success(
        "Noticia enviada a papelera correctamente",
        news_service.soft_delete_by_id(id),
        status.HTTP_200_OK,
    )
