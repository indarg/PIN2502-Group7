from django.urls import path

from motor_insight.interfaces.private.create_news_controller import create_news_controller
from motor_insight.interfaces.private.create_tag_controller import create_tag_controller
from motor_insight.interfaces.private.create_yt_videos_controller import create_yt_videos_controller
from motor_insight.interfaces.private.delete_news_by_id_controller import delete_news_by_id_controller
from motor_insight.interfaces.private.delete_tag_by_id_controller import delete_tag_by_id_controller
from motor_insight.interfaces.private.delete_yt_video_by_id_controller import delete_yt_video_by_id_controller
from motor_insight.interfaces.private.get_all_tags_crm_controller import get_all_tags_crm_controller
from motor_insight.interfaces.private.get_news_by_id_controller import get_news_by_id_controller
from motor_insight.interfaces.private.get_news_crm_controller import get_news_crm_controller
from motor_insight.interfaces.private.get_tag_by_id_controller import get_tag_by_id_controller
from motor_insight.interfaces.private.get_tags_crm_controller import get_tags_crm_controller
from motor_insight.interfaces.private.get_yt_video_by_id_controller import get_youtube_by_id_controller
from motor_insight.interfaces.private.get_yt_videos_crm_controller import get_yt_videos_crm_controller
from motor_insight.interfaces.private.restore_news_by_id_controller import restore_news_by_id_controller
from motor_insight.interfaces.private.soft_delete_news_by_id_controller import soft_delete_news_by_id_controller
from motor_insight.interfaces.private.update_news_controller import update_news_controller
from motor_insight.interfaces.private.update_order_yt_videos_controller import update_order_yt_videos_controller
from motor_insight.interfaces.private.update_tags_controller import update_tags_controller
from motor_insight.interfaces.private.update_yt_video_controller import update_yt_video_controller

urlpatterns = [
    path("yt-videos/<str:id>", get_youtube_by_id_controller, name="update_yt_video_controller"),
    path("yt-videos/delete/<str:id>", delete_yt_video_by_id_controller, name="delete_yt_video_by_id_controller"),
    path("yt-videos/update/<str:id>", update_yt_video_controller, name="update_yt_video_controller"),
    path("yt-videos/create/", create_yt_videos_controller, name="create_yt_videos_controller"),
    path("yt-videos/update/order/", update_order_yt_videos_controller, name="update_order_yt_videos_controller"),
    path("yt-videos/", get_yt_videos_crm_controller,  name="get_yt_videos_crm_controller"),
    path("news/", get_news_crm_controller, name="get_news_crm_controller"),
    path("news/<str:id>", get_news_by_id_controller, name="get_news_by_id_controller"),
    path("news/delete/<str:id>", delete_news_by_id_controller, name="delete_news_by_id_controller"),
    path("news/delete/soft/<str:id>", soft_delete_news_by_id_controller, name="soft_delete_news_by_id_controller"),
    path("news/update/<str:id>", update_news_controller, name="update_news_controller"),
    path("news/create/", create_news_controller, name="create_news_controller"),
    path("news/restore/<str:id>", restore_news_by_id_controller, name="restore_release_by_id_controller"),
    path("tags/", get_tags_crm_controller, name="get_tags_crm_controller"),
    path("tags/all", get_all_tags_crm_controller, name="get_all_tags_crm_controller"),
    path("tags/create/", create_tag_controller, name="create_tag_controller"),
    path("tags/delete/<str:id>", delete_tag_by_id_controller, name="delete_tag_by_id_controller"),
    path("tags/update/<str:id>", update_tags_controller, name="update_tags_controller"),
    path("tags/<str:id>", get_tag_by_id_controller, name="get_tag_by_id_controller"),
]
