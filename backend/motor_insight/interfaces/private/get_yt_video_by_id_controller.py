from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from motor_insight.service.impl.youtube_service_impl import YouTubeVideoServiceImpl


@api_view(["GET"])
def get_youtube_by_id_controller(request, id):
    """
    return YouTubeVideoTO by id.
    """
    youtube_service = YouTubeVideoServiceImpl()
    return api_response_success(
        "YouTube video encontrado correctamente",
        youtube_service.get_by_id(id),
        status.HTTP_200_OK,
    )
