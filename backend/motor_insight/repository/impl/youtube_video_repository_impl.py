"""Contains the youtube_video repository"""
from typing import Dict

from common.helpers.query_options import QueryOptions
from common.serializer.CamelCaseMixin import to_camelcase_data
from motor_insight.contract.to.youtube_video_to import YouTubeVideoTO
from motor_insight.contract.update_order_youtube_video_in import UpdateOrderYoutubeVideoIn
from motor_insight.models.youtube_video import YouTubeVideo
from motor_insight.repository.youtube_video_repository import YouTubeVideoRepository


class YouTubeVideoRepositoryImpl(YouTubeVideoRepository):
    """Contains the database access for youtube_video model"""

    def soft_delete_by_id(self, id):
        pass

    def restore_by_id(self, id):
        pass

    def create_or_update(self, data, update=False):
        """
        Add new youtube_video to the database.
        """
        youtube_video = YouTubeVideo.from_to(data, False, update)
        return YouTubeVideoTO.from_model(youtube_video)

    def update_order(self, data:Dict[str,int]):
        """
        updates_order elements
        """
        ids_to_update = list(data.keys())
        items = YouTubeVideo.objects.filter(id__in=ids_to_update)

        objects_to_update = []
        for item in items:
            item.order = data.get(item.id)
            objects_to_update.append(item)

        YouTubeVideo.objects.bulk_update(objects_to_update, ['order'])

    def update_order_after_update_or_delete(self,start_order:int):
        items_to_update = YouTubeVideo.objects.filter(order__gt=start_order).order_by('order')
        for item in items_to_update:
            item.order -= 1

        if items_to_update:
            YouTubeVideo.objects.bulk_update(items_to_update, ['order'])


    def get_youtube_videos_by_filters(self, **kwargs) -> YouTubeVideoTO | None:
        filters = {key: value for key, value in kwargs.items() if value is not None}
        youtube_video_found = YouTubeVideo.objects.filter(**filters).first()
        return YouTubeVideoTO.from_model(youtube_video_found)

    def get_all(self, **kwargs) -> list[YouTubeVideoTO]:
        filters = {key: value for key, value in kwargs.items() if value is not None}
        youtube_video_query = YouTubeVideo.objects.filter(**filters).order_by('order')[:18]
        return [] if not youtube_video_query or len(youtube_video_query) == 0 else YouTubeVideoTO.from_models(youtube_video_query)

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs) -> dict:
        youtube_video_query = YouTubeVideo.objects.all()

        # Ensure query_options exists
        if not query_options:
            query_options = QueryOptions(
                page_number=0,
                page_size=10,
                order_by={"created_at": "asc"}  # Default ordering by id
            )

        query_options.add_order_by({"created_at": "asc"})

        # Handle query_options if provided, otherwise return all records without pagination
        if query_options:
            # Get searchable fields, including related fields if needed
            #  query_options.search_fields = query_options.get_queryable_fields(
            #      model=YouTubeVideo, include_relations=True
            #  )

            # Apply filters, ordering, and pagination
            paginated_youtube_videos = query_options.filter_and_exec_queryset(youtube_video_query, model=YouTubeVideo)

        return {
            'results': [],
            'total': 0,
        } if not paginated_youtube_videos['results'] or len(paginated_youtube_videos['results']) == 0 else {
            'results': [to_camelcase_data(youtube_videoTO.to_dict()) for youtube_videoTO in
                        YouTubeVideoTO.from_models(paginated_youtube_videos['results'])],
            'total': paginated_youtube_videos['total'],
        }

    def get_by_id(self, id):
        try:
            return YouTubeVideoTO.from_model(YouTubeVideo.objects.get(id=id))
        except YouTubeVideo.DoesNotExist:
            return None

    def delete_by_id(self, obj_id):
        try:
            youtube_video = YouTubeVideo.objects.get(id=obj_id)
            youtube_video.delete()
            return True
        except YouTubeVideo.DoesNotExist:
            return False

    def get_deleted_by_id(self, id):
        pass