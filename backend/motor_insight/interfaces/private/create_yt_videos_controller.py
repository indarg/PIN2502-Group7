from rest_framework import status
from rest_framework.decorators import api_view
from common.helpers.api_responses import api_response_success
from common.serializer.CamelCaseMixin import to_snake_case_data
from motor_insight.contract.create_update_yt_video_in import CreateUpdateYTVideoIn
from motor_insight.service.impl.youtube_service_impl import YouTubeVideoServiceImpl
from user_management.decorators.valid_role import valid_role


@api_view(['POST'])
@valid_role("Admin")
def create_yt_videos_controller(request):
    """
    Create a new yt_videos.
    """
    yt_videos_service = YouTubeVideoServiceImpl()
    create_yt_videos_in = CreateUpdateYTVideoIn(data=to_snake_case_data(request.data))

    return api_response_success(
        "¡YT Video creado exitosamente!", yt_videos_service.create(create_yt_videos_in), status.HTTP_200_OK
    )

