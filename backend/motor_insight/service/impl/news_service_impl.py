"""Contains the news service"""
from sqlite3 import IntegrityError

from common.exceptions.exceptions import (
    NotFoundException, BadRequestException,
)
from common.helpers.query_options import QueryOptions
from common.serializer.CamelCaseMixin import to_camelcase_data
from common.service.impl.storage_service_impl import StorageServiceImpl
from motor_insight.contract.create_news_in import CreateNewsIn
from motor_insight.contract.to.news_to import NewsTO
from motor_insight.contract.update_news_in import UpdateNewsIn

from motor_insight.repository.impl.news_repository_impl import NewsRepositoryImpl
from motor_insight.service.news_service import NewsService


class NewsServiceImpl(NewsService):
    """Business logic for news management"""

    def __init__(self):
        self.repository = NewsRepositoryImpl()
        self.storage_service = StorageServiceImpl()

    def restore_by_id(self, id):
        return self.repository.restore_by_id(id)

    def soft_delete_by_id(self, id):
        return to_camelcase_data(self.repository.soft_delete_by_id(id))

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs):
        paginated_news = self.repository.get_all_by_query_options(query_options)
        return paginated_news

    def get_by_id(self, id):
        news = self.repository.get_by_id(id)
        if news is None:
            raise NotFoundException("No se encuentra la noticia")
        return to_camelcase_data(news.to_dict())

    def delete_by_id(self, id):
        news = self.repository.get_deleted_by_id(id)
        if news is None:
            raise NotFoundException("No se encuentra la noticia")
        if news.mainImage is not None:
            self.storage_service.delete_file_from_storage(news.mainImage.file_url)
        for column in news.columns:
            self.storage_service.delete_file_from_storage(column.image.file_url)
        for images in news.images:
            self.storage_service.delete_file_from_storage(images.file_url)

        return self.repository.delete_by_id(id)

    def soft_delete_by_id(self, id):
        return self.repository.soft_delete_by_id(id)

    def update(self, id, data: UpdateNewsIn):
        if self.repository.get_by_id(id) is None:
            raise NotFoundException("No se encuentra la noticia")
        if data.initial_data['published'] and not data.is_valid():
            raise BadRequestException("El formulario no ha sido rellenado correctamente", data.errors)
        news_to = NewsTO.from_update_in(data)
        try:
            edited_news = self.repository.create_or_update(news_to, True)
        except IntegrityError:
            return BadRequestException("Ya existe una noticia con ese título")
        return to_camelcase_data(edited_news.to_dict())

    def create(self, data: CreateNewsIn):
        """Business logic to create news"""
        if data.initial_data['published'] and not data.is_valid():
            raise BadRequestException("El formulario no ha sido rellenado correctamente", data.errors)
        news_to = NewsTO.from_create_in(data)
        try:
            created_news = self.repository.create_or_update(news_to)
        except IntegrityError:
            return BadRequestException("Ya existe una noticia con ese título")
        return to_camelcase_data(created_news.to_dict())

    def get_all(self, **kwargs):
        """Business logic to retrieve all news"""
        newss = self.repository.get_all(**kwargs)
        if not newss:
            raise NotFoundException("No se encuentran noticias")
        return [to_camelcase_data(news.to_dict()) for news in newss]

    def get_filtered_and_ordered(self, search_value=None):
        return [to_camelcase_data(news.to_dict()) for news in self.repository.get_filtered_and_ordered(search_value)]
