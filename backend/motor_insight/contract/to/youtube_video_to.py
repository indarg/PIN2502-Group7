"""This module contains the disaggregation Transfer Object"""
from dataclasses import dataclass
from typing import Optional

from common.contract.to import AuditTO
from motor_insight.models.youtube_video import YouTubeVideo


@dataclass
class YouTubeVideoTO(AuditTO):
    """YouTubeVideo TO"""
    id: str = ''
    title: str = ''
    order: int = 0
    active: bool = False

    @classmethod
    def from_model(cls, instance: YouTubeVideo) -> Optional['YouTubeVideoTO']:
        """Transforms YouTubeVideo instance into a YouTubeVideoTO representation."""
        if instance is None:
            return None
        audit_data = super().audit_to_dict(instance)
        return cls(
            id=instance.id,
            title=instance.title,
            order=instance.order,
            active=instance.active,
            created_by=audit_data["created_by"],
            updated_by=audit_data["updated_by"],
            updated_at=audit_data["updated_at"],
            created_at=audit_data["created_at"],
        )
