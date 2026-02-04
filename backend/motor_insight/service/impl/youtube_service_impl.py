"""Contains the youtube_video service"""
from sqlite3 import IntegrityError

from common.exceptions.exceptions import (
    NotFoundException, BadRequestException,
)
from common.helpers.query_options import QueryOptions
from common.serializer.CamelCaseMixin import to_camelcase_data
from motor_insight.contract.create_update_yt_video_in import CreateUpdateYTVideoIn
from motor_insight.contract.to.youtube_video_to import YouTubeVideoTO
from motor_insight.contract.update_order import UpdateOrderIn
from motor_insight.contract.update_order_youtube_video_in import UpdateOrderYoutubeVideoIn
from motor_insight.repository.impl.youtube_video_repository_impl import YouTubeVideoRepositoryImpl
from motor_insight.service.youtube_service import YouTubeVideoService


class YouTubeVideoServiceImpl(YouTubeVideoService):
    """Business logic for youtube_video management"""

    def __init__(self):
        self.repository = YouTubeVideoRepositoryImpl()

    def soft_delete_by_id(self, id):
        pass

    def restore_by_id(self, id):
        pass

    def create(self, create_youtube_video_in: CreateUpdateYTVideoIn):
        """Business logic to retrieve all youtube_video"""
        if not create_youtube_video_in.is_valid():
            raise BadRequestException("El formulario no ha sido rellenado correctamente", create_youtube_video_in.errors)
        youtube_video_to = YouTubeVideoTO.from_serializer(create_youtube_video_in)
        try:
            created_youtube_video = self.repository.create_or_update(youtube_video_to)
        except IntegrityError:
            return BadRequestException("Ya existe un video con ese codigo o titulo")
        return to_camelcase_data(created_youtube_video.to_dict())

    def get_by_id(self, id):
        youtube_video = self.repository.get_by_id(id)
        if youtube_video is None:
            raise NotFoundException("No se encuentra video")
        return to_camelcase_data(youtube_video.to_dict())

    def delete_by_id(self, id):
        youtube_video = self.repository.get_by_id(id)
        if youtube_video is None:
            raise NotFoundException("No se encuentra video")
        self.repository.delete_by_id(id)
        if youtube_video.active is True :
            self.repository.update_order_after_update_or_delete(youtube_video.order)
        return "Video eliminado correctamente"

    def update_order(self, data: UpdateOrderYoutubeVideoIn):
        if not data.is_valid():
            raise BadRequestException("El formulario no ha sido rellenado correctamente", data.errors)
        orders_by_id = {item['id']: item['order'] for item in data.validated_data['videos']}
        self.repository.update_order(orders_by_id)

        return 'Orden de videos actualizados'

    def update(self, obj_id, data: CreateUpdateYTVideoIn):
        current_video = self.repository.get_by_id(obj_id)
        if current_video is None:
            raise NotFoundException("No se encuentra la video")
        if not data.is_valid():
            raise BadRequestException("El formulario no ha sido rellenado correctamente", data.errors)
        youtube_video_to = YouTubeVideoTO.from_serializer(data)
        try:
            if youtube_video_to.active is False and current_video.active is True and current_video.order > -1:
                self.repository.update_order_after_update_or_delete(youtube_video_to.order)
            updated_youtube_video = self.repository.create_or_update(youtube_video_to,True)
        except IntegrityError:
            return BadRequestException("Ya existe un video con ese codigo u nombre")
        return to_camelcase_data(updated_youtube_video.to_dict())

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs):
        """Business logic to retrieve all youtube_video"""
        return self.repository.get_all_by_query_options(query_options)

    def get_all(self, **kwargs):
        """Business logic to retrieve all youtube_videos"""
        youtube_videos = self.repository.get_all(**kwargs)
        if not youtube_videos:
            raise NotFoundException("No se encuentran videos")
        return [to_camelcase_data(youtube_video.to_dict()) for youtube_video in youtube_videos]
