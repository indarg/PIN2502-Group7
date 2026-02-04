from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.serializer.CamelCaseMixin import to_snake_case_data
from motor_insight.contract.create_news_in import CreateNewsIn
from motor_insight.contract.update_news_in import UpdateNewsIn
from motor_insight.contract.update_tag_in import UpdateTagIn
from motor_insight.service.impl.news_service_impl import NewsServiceImpl
from motor_insight.service.impl.tag_service_impl import TagServiceImpl
from user_management.decorators.valid_role import valid_role


@api_view(['PUT'])
@valid_role("Admin")
def update_tags_controller(request, id):
    """
    Create a new tags.
    """

    tags_service = TagServiceImpl()
    update_tags_in = UpdateTagIn(data=to_snake_case_data(request.data))

    return api_response_success(
        "¡Noticia actualizada exitosamente!", tags_service.update(id, update_tags_in), status.HTTP_200_OK
    )
