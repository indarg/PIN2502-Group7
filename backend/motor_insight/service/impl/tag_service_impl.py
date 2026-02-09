"""Contains the tag service"""
from sqlite3 import IntegrityError

from common.exceptions.exceptions import (
    NotFoundException, BadRequestException,
)
from common.helpers.query_options import QueryOptions
from common.serializer.CamelCaseMixin import to_camelcase_data
from motor_insight.contract.create_tag_in import CreateTagIn
from motor_insight.contract.to.tag_to import TagTO
from motor_insight.contract.update_tag_in import UpdateTagIn
from motor_insight.repository.impl.tag_repository_impl import TagRepositoryImpl
from motor_insight.service.tag_service import TagService


class TagServiceImpl(TagService):
    """Business logic for tag management"""

    def __init__(self):
        self.repository = TagRepositoryImpl()

    def soft_delete_by_id(self, id):
        pass

    def restore_by_id(self, id):
        pass

    def get_by_id(self, id):
        tag = self.repository.get_by_id(id)
        if tag is None:
            raise NotFoundException("No se encuentra etiqueta")
        return to_camelcase_data(tag.to_dict())

    def delete_by_id(self, id):
        tag = self.repository.get_by_id(id)
        if tag is None:
            raise NotFoundException("No se encuentra etiqueta")
        self.repository.delete_by_id(id)
        return "Etiqueta eliminada correctamente"

    def update(self, obj_id, data: UpdateTagIn):
        if self.repository.get_by_id(obj_id) is None:
            raise NotFoundException("No se encuentra la etiqueta")
        if not data.is_valid():
            raise BadRequestException("El formulario no ha sido rellenado correctamente", data.errors)
        tag_to = TagTO.from_serializer(data)
        try:
            updated_tag = self.repository.create_or_update(tag_to,True)
        except IntegrityError:
            return BadRequestException("Ya existe una etiqueta con ese codigo u nombre")
        return to_camelcase_data(updated_tag.to_dict())

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs):
        """Business logic to retrieve all tag"""
        return self.repository.get_all_by_query_options(query_options)

    def get_all(self, **kwargs):
        """Business logic to retrieve all tags"""
        tags = self.repository.get_all(**kwargs)
        if not tags:
            raise NotFoundException("No se encuentran etiquetas")
        return [to_camelcase_data(tag.to_dict()) for tag in tags]

    def create(self, create_tag_in: CreateTagIn):
        """Business logic to retrieve all tag"""
        if not create_tag_in.is_valid():
            raise BadRequestException("El formulario no ha sido rellenado correctamente", create_tag_in.errors)
        tag_to = TagTO.from_serializer(create_tag_in)
        try:
            created_tag = self.repository.create_or_update(tag_to)
        except IntegrityError:
            return BadRequestException("Ya existe una etiqueta con ese codigo u nombre")
        return to_camelcase_data(created_tag.to_dict())
