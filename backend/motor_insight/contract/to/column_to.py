"""This module contains the disaggregation Transfer Object"""
from dataclasses import dataclass
from typing import Optional

from common.contract.to.base_to import BaseTO
from common.contract.to.media_file_to import MediaFileTO
from motor_insight.models.column import Column


@dataclass
class ColumnTO(BaseTO):
    """Column TO"""
    image: Optional[MediaFileTO]
    id: int | None = None
    title: str = ''
    body: str = ''

    @classmethod
    def from_model(cls, instance: Column) -> Optional['ColumnTO']:
        """Transforms Column instance into a ColumnTO representation."""
        if instance is None:
            return None
        return cls(
            id=instance.id,
            title=instance.title,
            body=instance.body,
            image=MediaFileTO.from_model(instance.image)
        )
