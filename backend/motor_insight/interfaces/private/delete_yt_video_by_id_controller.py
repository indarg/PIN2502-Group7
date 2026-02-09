from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions
from motor_insight.service.impl.youtube_service_impl import YouTubeVideoServiceImpl


@api_view(["DELETE"])
def delete_yt_video_by_id_controller(request, id: int):
    """
    List all yt_video and return them in TagTO format.
    """
    yt_video_service = YouTubeVideoServiceImpl()
    return api_response_success(
        "Video eliminado correctamente",
        yt_video_service.delete_by_id(id),
        status.HTTP_200_OK,
    )
