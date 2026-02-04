from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.serializer.CamelCaseMixin import to_snake_case_data
from motor_insight.contract.create_tag_in import CreateTagIn
from motor_insight.service.impl.tag_service_impl import TagServiceImpl
from user_management.decorators.valid_role import valid_role


@api_view(['POST'])
@valid_role("Admin")
def create_tag_controller(request):
    """
    Create a new tag.
    """

    tag_service = TagServiceImpl()
    create_tag_in = CreateTagIn(data=to_snake_case_data(request.data))

    return api_response_success(
        "¡Lanzamiento creado exitosamente!", tag_service.create(create_tag_in), status.HTTP_200_OK
    )

