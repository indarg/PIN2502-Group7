"""This module contains the crm_urls related with analysis stuff"""

from django.urls import path, include

from motor_insight.interfaces.public.get_yt_videos_controller import get_yt_videos_controller

from motor_insight.interfaces.public.get_news_by_id_controller import get_news_by_id_controller
from motor_insight.interfaces.public.get_news_controller import get_news_controller
from motor_insight.interfaces.public.get_tags_controller import get_tags_controller
from motor_insight.interfaces.public.global_searcher_controller import global_searcher_controller

urlpatterns = [
    path('global-search/', global_searcher_controller, name='global_searcher_controller'),
    path("news/", get_news_controller, name="get_news_controller"),
    path("yt-videos/", get_yt_videos_controller, name="get_yt_videos_controller"),
    path("tags/", get_tags_controller, name="get_tags_controller"),
    path("news/<str:id>", get_news_by_id_controller, name="get_news_by_id_controller"),
    path('crm/', include('motor_insight.crm_urls')),
]
