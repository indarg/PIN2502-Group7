from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from motor_insight.service.impl.news_service_impl import NewsServiceImpl


@api_view(["PUT"])
def restore_news_by_id_controller(request, id):
    """
    Restore a news record from the recycle trash
    """
    news_service = NewsServiceImpl()
    return api_response_success(
        "Noticia restaurada correctamente",
        news_service.restore_by_id(id),
        status.HTTP_200_OK,
    )
