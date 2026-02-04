"""This module contains the disaggregation Transfer Object"""
import datetime
from dataclasses import dataclass
from typing import Optional

from common.contract.to.audit_to import AuditTO
from common.contract.to.media_file_to import MediaFileTO
from motor_insight.contract.create_news_in import CreateNewsIn
from motor_insight.contract.to.column_to import ColumnTO
from motor_insight.contract.to.tag_to import TagTO
from motor_insight.contract.update_news_in import UpdateNewsIn
from motor_insight.models.news import News


@dataclass
class NewsTO(AuditTO):
    """News TO"""
    mainImage: Optional[MediaFileTO] = None
    videos: Optional[list[MediaFileTO]] = None
    images: Optional[list[MediaFileTO]] = None
    columns: Optional[list[ColumnTO]] = None
    tags: Optional[list[TagTO]] = None
    id: Optional[int] = None
    description: str = ""
    headline: str = ""
    lead: str = ""
    body: str = ""
    closure: str = ""
    published: bool = False
    draft: bool = False
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None

    @classmethod
    def from_model(cls, instance: News) -> Optional["NewsTO"]:
        """Transforms News instance into a NewsTO representation."""
        audit_data = super().audit_to_dict(instance)
        if instance is None:
            return None
        return cls(
            id=instance.id,
            videos=MediaFileTO.from_models(instance.videos.all()),
            images=MediaFileTO.from_models(instance.images.all()),
            headline=instance.headline,
            mainImage=MediaFileTO.from_model(instance.main_image),
            description=instance.description,
            columns=ColumnTO.from_models(instance.columns.all()),
            tags=TagTO.from_models(instance.tags.all()),
            lead=instance.lead,
            body=instance.body,
            draft=instance.draft,
            closure=instance.closure,
            published=instance.published,
            is_deleted=instance.is_deleted,
            deleted_at=instance.deleted_at,
            created_by=audit_data["created_by"],
            updated_by=audit_data["updated_by"],
            updated_at=audit_data["updated_at"],
            created_at=audit_data["created_at"],
        )

    @classmethod
    def from_update_in(cls, update_in: UpdateNewsIn) -> Optional["NewsTO"]:
        """Transforms News update_in into a NewsTO representation."""
        if update_in is None:
            return None
        validated_data = update_in.initial_data if update_in.initial_data['published'] else update_in.initial_data
        return cls(
            id=validated_data['id'],
            videos=[MediaFileTO.from_dict(image) for image in validated_data['videos']],
            images=[MediaFileTO.from_dict(image) for image in validated_data['images']],
            headline=validated_data['headline'],
            mainImage=MediaFileTO.from_dict(validated_data['main_image']) if 'main_image' in validated_data else None,
            description=validated_data['description'],
            columns=[ColumnTO.from_dict(column) for column in validated_data['columns']],
            tags=[TagTO.from_dict(tag) for tag in validated_data['tags']],
            lead=validated_data['lead'],
            body=validated_data['body'],
            draft=validated_data['draft'],
            closure=validated_data['closure'],
            published=validated_data['published'],

        )

    @classmethod
    def from_create_in(cls, create_in: CreateNewsIn) -> Optional["NewsTO"]:
        """Transforms News create_in into a NewsTO representation."""
        if create_in is None:
            return None
        validated_data = create_in.initial_data if create_in.initial_data['published'] else create_in.initial_data
        return cls(
            videos=[MediaFileTO.from_dict(image) for image in validated_data['videos']],
            images=[MediaFileTO.from_dict(image) for image in validated_data['images']],
            headline=validated_data['headline'],
            mainImage=MediaFileTO.from_dict(validated_data['main_image']) if 'main_image' in validated_data else None,
            description=validated_data['description'],
            columns=[ColumnTO.from_dict(column) for column in validated_data['columns']],
            tags=[TagTO.from_dict(tag) for tag in validated_data['tags']],
            lead=validated_data['lead'],
            body=validated_data['body'],
            draft=validated_data['draft'],
            closure=validated_data['closure'],
            published=validated_data['published'],
        )
