"""This module contains the yt_video model"""
from django.db import models, transaction, IntegrityError
from django.utils.timezone import now

from common.exceptions.exceptions import BadRequestException
from common.helpers.utils import convert_field
from common.middlewares.audit_middleware import get_current_user
from user_management.models.audit_model import AuditModel


class YouTubeVideo(AuditModel):
    """YouTubeVideo model for managing yt_video, and tests."""
    id = models.CharField(primary_key=True,max_length=110, blank=True, unique=True)
    title = models.CharField(max_length=160, blank=True, unique=True)
    order = models.IntegerField( blank=True, unique=False)
    active = models.BooleanField( blank=True, default=False)

    class Meta:
        """Table's metadata"""
        db_table = 'yt_video'

    @classmethod
    def from_to(cls, yt_video_to, check_exists: bool = False, update=False) -> 'YouTubeVideo':
        """
        Creates a YouTubeVideo instance from an YouTubeVideoTO instance without saving it.

        Args:
            yt_video_to (YouTubeVideoTO): Transfer Object containing the YouTubeVideo data.

        Returns:
            YouTubeVideo: An instance of the YouTubeVideo model.
            :param update:
            :param yt_video_to:
            :param check_exists:
        """
        from motor_insight.contract.to.youtube_video_to import YouTubeVideoTO
        if not isinstance(yt_video_to, YouTubeVideoTO):
            yt_video_to = convert_field(yt_video_to, YouTubeVideoTO)

        if  yt_video_to.active:
            result = YouTubeVideo.objects.all().order_by('-order').first()
            yt_video_to.order = result.order + 1 if result else 0
        elif yt_video_to.active is False:
            yt_video_to.order = -1
        update_or_create_defaults = {
            'id': yt_video_to.id,
            'title': yt_video_to.title,
            'order':yt_video_to.order,
            'active': yt_video_to.active,
        }
        with transaction.atomic():
            if update and yt_video_to.id is not None:
                YouTubeVideo.objects.filter(id=yt_video_to.id).update(
                    updated_by=get_current_user(),
                    updated_at=now(),
                    **update_or_create_defaults
                )
                yt_video_instance = YouTubeVideo.objects.get(id=yt_video_to.id)
            else:
                try:
                    yt_video_instance = YouTubeVideo.objects.create(
                        **update_or_create_defaults
                    )
                except IntegrityError as e:
                    raise BadRequestException("Ya existe un video con ese identificador")

        return yt_video_instance
