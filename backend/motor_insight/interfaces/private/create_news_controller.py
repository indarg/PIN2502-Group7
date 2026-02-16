from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.serializer.CamelCaseMixin import to_snake_case_data
from motor_insight.contract.create_news_in import CreateNewsIn
from motor_insight.service.impl.news_service_impl import NewsServiceImpl
from user_management.decorators.valid_role import valid_role


@api_view(['POST'])
@valid_role("Admin")
def create_news_controller(request):
    """
    Create a new news.
    """

    news_service = NewsServiceImpl()
    create_news_in = CreateNewsIn(data=to_snake_case_data(request.data))
    return api_response_success(
        "¡Noticia creada exitosamente!", news_service.create(create_news_in), status.HTTP_200_OK
    )

