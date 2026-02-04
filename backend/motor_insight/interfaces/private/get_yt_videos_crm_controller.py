from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions
from motor_insight.service.impl.youtube_service_impl import YouTubeVideoServiceImpl


@api_view(["GET"])
def get_yt_videos_crm_controller(request):
    """
    List all yt_video and return them in YouTubeVideoTO format.
    """
    yt_video_service = YouTubeVideoServiceImpl()
    query_options = QueryOptions.from_request(request)

    return api_response_success(
        "YT Videos encontrados",
        yt_video_service.get_all_by_query_options(query_options),
        status.HTTP_200_OK,
    )
