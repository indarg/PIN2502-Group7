from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions
from motor_insight.service.impl.news_service_impl import NewsServiceImpl


@api_view(["GET"])
def get_news_controller(request):
    """
    List all news and return them in NewsTO format.
    """
    news_service = NewsServiceImpl()
    query_options = QueryOptions.from_request(request)
    query_options.filters['published'] = True
    query_options.filters['is_deleted'] = False
    return api_response_success(
        "News retrieved successfully",
        news_service.get_all_by_query_options(query_options),

        status.HTTP_200_OK,
    )
