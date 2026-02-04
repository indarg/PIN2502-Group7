from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions
from motor_insight.service.impl.news_service_impl import NewsServiceImpl


@api_view(["POST"])
def global_searcher_controller(request):
    """
    List all news and return them in NewsTO format.
    """
    news_service = NewsServiceImpl()
    search_value = request.data['searchValue']
    query_options = QueryOptions.from_request(request)
    query_options.filters['published'] = True
    query_options.filters['is_deleted'] = False
    news = news_service.get_filtered_and_ordered(search_value=search_value)

    return api_response_success(
        "Results retrieved successfully",
        {
            "news": news,
        },
        status.HTTP_200_OK,
    )
