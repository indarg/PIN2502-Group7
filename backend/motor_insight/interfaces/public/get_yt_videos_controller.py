from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from motor_insight.service.impl.youtube_service_impl import YouTubeVideoServiceImpl


@api_view(["GET"])
def get_yt_videos_controller(request):
    """
    List all yt_video and return them in YouTubeVideoTO format.
    """
    yt_video_service = YouTubeVideoServiceImpl()

    return api_response_success(
        "Videos encontradas",
        yt_video_service.get_all(active=True),
        status.HTTP_200_OK,
    )
