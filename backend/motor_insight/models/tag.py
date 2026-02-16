"""This module contains the tag model"""
from django.db import models, transaction
from django.utils.timezone import now

from common.exceptions.exceptions import BadRequestException
from common.helpers.utils import convert_field
from common.middlewares.audit_middleware import get_current_user
from user_management.models.audit_model import AuditModel


class Tag(AuditModel):
    """Tag model for managing tag, and tests."""
    code = models.CharField(max_length=50, blank=True, unique=True)
    name = models.CharField(max_length=140, blank=True, unique=True)

    class Meta:
        """Table's metadata"""
        db_table = 'tag'

    @classmethod
    def from_to(cls, tag_to, check_exists: bool = False, update=False) -> 'Tag':
        """
        Creates a Tag instance from an TagTO instance without saving it.

        Args:
            tag_to (TagTO): Transfer Object containing the Tag data.

        Returns:
            Tag: An instance of the Tag model.
            :param update:
            :param tag_to:
            :param check_exists:
        """
        from motor_insight.contract.to.tag_to import TagTO
        if not isinstance(tag_to, TagTO):
            tag_to = convert_field(tag_to, TagTO)

        existing_tag = Tag.objects.filter(name=tag_to.name)
        if check_exists and existing_tag.exists() and existing_tag[0].id != tag_to.id:
            raise BadRequestException("Ya existe una etiqueta con ese mismo nombre")

        update_or_create_defaults = {
            'name': tag_to.name,
            'code': tag_to.code
        }
        with transaction.atomic():
            if update and tag_to.id is not None and tag_to.id > 0:
                print(f"update:{update}")
                Tag.objects.filter(id=tag_to.id).update(
                    updated_by=get_current_user(),
                    updated_at=now(),
                    **update_or_create_defaults
                )
                tag_instance = Tag.objects.get(id=tag_to.id)
            else:
                print(f"create")
                tag_instance = Tag.objects.create(
                    **update_or_create_defaults
                )

        return tag_instance
