from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.serializer.CamelCaseMixin import to_snake_case_data
from motor_insight.contract.update_order import UpdateOrderIn
from motor_insight.contract.update_order_youtube_video_in import UpdateOrderYoutubeVideoIn
from motor_insight.service.impl.youtube_service_impl import YouTubeVideoServiceImpl
from user_management.decorators.valid_role import valid_role


@api_view(['PUT'])
@valid_role("Admin")
def update_order_yt_videos_controller(request):
    """
    Update yt_videos order.
    """
    yt_video_service = YouTubeVideoServiceImpl()
    update_yt_video_in = UpdateOrderYoutubeVideoIn(data=to_snake_case_data(request.data))

    return api_response_success(
     yt_video_service.update_order( update_yt_video_in), status.HTTP_200_OK
    )
