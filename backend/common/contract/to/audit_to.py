from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any

from common.contract.to.base_to import BaseTO
from user_management.models.audit_model import AuditModel



@dataclass
class AuditTO(BaseTO):
    """Audit TO"""
    created_by: Optional['UserTO'] = None
    created_at: Optional[datetime] = None
    updated_by: Optional['UserTO'] = None
    updated_at: Optional[datetime] = None

    @classmethod
    def from_model(cls, instance: Optional['AuditModel']) -> Optional['AuditTO']:
        """Transform AuditModel using BaseTO's from_dict capability"""
        if instance is None:
            return None

        # Leverage BaseTO's automatic nested TO mapping
        audit_dict = {
            'created_by': instance.created_by.__dict__ if instance.created_by else None,
            'created_at': instance.created_at,
            'updated_by': instance.updated_by.__dict__ if instance.updated_by else None,
            'updated_at': instance.updated_at,
        }

        return cls.from_dict(audit_dict)

    def audit_to_dict(instance: Optional[AuditModel]) -> Optional[Dict]:
        """Transforms AuditModel instance into a dictionary representation."""
        from user_management.contract.to.user_to import UserTO
        if instance is None:
            return None
        return {
            "created_by": UserTO.from_model(instance.created_by),
            "created_at": instance.created_at,
            "updated_by": UserTO.from_model(instance.updated_by),
            "updated_at": instance.updated_at,
        }

    def to_dict_clean(self) -> Dict[str, Any]:
        """Return dict excluding None values for API responses"""
        result = self.to_dict()
        return {k: v for k, v in result.items() if v is not None}
