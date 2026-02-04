from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.serializer.CamelCaseMixin import to_snake_case_data
from motor_insight.contract.create_news_in import CreateNewsIn
from motor_insight.contract.update_news_in import UpdateNewsIn
from motor_insight.service.impl.news_service_impl import NewsServiceImpl
from user_management.decorators.valid_role import valid_role


@api_view(['PUT'])
@valid_role("Admin")
def update_news_controller(request, id):
    """
    Create a new news.
    """

    news_service = NewsServiceImpl()
    update_news_in = UpdateNewsIn(data=to_snake_case_data(request.data))

    return api_response_success(
        "¡Noticia actualizada exitosamente!", news_service.update(id, update_news_in), status.HTTP_200_OK
    )
