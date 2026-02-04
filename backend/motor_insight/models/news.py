"""This module contains the news model"""
from django.db import models, transaction
from django.utils.timezone import now

from common.exceptions.exceptions import BadRequestException
from common.middlewares.audit_middleware import get_current_user
from common.models.base_model import SoftDeleteMixin
from motor_insight.models.note import Note
from motor_insight.models.tag import Tag


class News(SoftDeleteMixin,  Note):
    """News model for managing automotive news, launches, and tests."""
    columns = models.ManyToManyField('Column', blank=True)
    class Meta:
        """Table's metadata"""
        db_table = 'news'
        ordering = ['-created_at']

    @classmethod
    def from_to(cls, news_to, check_exists=False, update=False) -> 'News':
        """
        Creates a News instance from an NewsTO instance without saving it.

        Args:
            news_to (NewsTO): Transfer Object containing the News data.

        Returns:
            News: An instance of the News model.
            :param update:
            :param news_to:
            :param check_exists:
        """
        from motor_insight.contract.to.news_to import NewsTO
        from common.models.media_file import MediaFile
        from motor_insight.models.column import Column
        if not isinstance(news_to, NewsTO):
            raise ValueError("The argument must be an instance of NewsTO")
        existing_news = News.objects.filter(headline=news_to.headline)
        if check_exists and existing_news.exists() and existing_news[0].id != news_to.id:
            raise BadRequestException("Ya existe una noticia con ese mismo título")



        update_or_create_defaults = {
            'lead': news_to.lead,
            'body': news_to.body,
            'closure': news_to.closure,
            'published': news_to.published,
            'main_image': MediaFile.from_to(news_to.mainImage),
            'headline': news_to.headline,
        }

        with transaction.atomic():
            if update and news_to.id is not None and news_to.id > 0:
                News.objects.filter(id=news_to.id).update(
                    updated_by=get_current_user(),
                    updated_at=now(),
                    **update_or_create_defaults
                )
                news_instance = News.objects.get(id=news_to.id)
            else:
                news_instance = News.objects.create(
                    **update_or_create_defaults
                )
            if news_to.images:
                news_instance.images.clear()
                for image in news_to.images:
                    news_instance.images.add(MediaFile.from_to(image, update))
            if news_to.videos:
                news_instance.videos.clear()
                for image in news_to.videos:
                    news_instance.videos.add(MediaFile.from_to(image, update))
            if news_to.columns:
                news_instance.columns.clear()
                for column in news_to.columns:
                    news_instance.columns.add(Column.from_to(column, False, update))
            if news_to.tags:
                news_instance.tags.set([Tag.objects.get(code=tag.code) for tag in news_to.tags])

        return news_instance
