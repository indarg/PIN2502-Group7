"""This module contains the disaggregation Transfer Object"""
from dataclasses import dataclass
from typing import Optional

from common.contract.to import AuditTO
from common.contract.to.base_to import BaseTO
from motor_insight.models.tag import Tag


@dataclass
class TagTO(AuditTO):
    """Tag TO"""
    id: int | None = None
    code: str = ''
    name: str = ''

    @classmethod
    def from_model(cls, instance: Tag) -> Optional['TagTO']:
        """Transforms Tag instance into a TagTO representation."""
        audit_data = super().audit_to_dict(instance)
        if instance is None:
            return None
        return cls(
            id=instance.id,
            code=instance.code,
            name=instance.name,
            created_by=audit_data["created_by"],
            updated_by=audit_data["updated_by"],
            updated_at=audit_data["updated_at"],
            created_at=audit_data["created_at"],
        )
