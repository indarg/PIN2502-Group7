"""This module contains the Audit model"""
from django.db import models

from common.middlewares.audit_middleware import get_current_user
from common.models.base_model import BaseModel


class AuditModel(models.Model, BaseModel):
    """This module contains the Audit model"""
    created_by = models.ForeignKey('user_management.User', related_name="%(class)s_created", on_delete=models.SET_NULL,
                                   null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey('user_management.User', related_name="%(class)s_updated", on_delete=models.SET_NULL,
                                   null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        user = get_current_user()
        if not self.pk and not self.created_by:
            self.created_by = user
        self.updated_by = user
        super().save(*args, **kwargs)


    @classmethod
    def from_to(cls, to_instance):
        """
        Create an instance from a Transfer Object (TO) without saving it.

        Args:
            to_instance: Transfer Object containing the data.

        Returns:
            An instance of the model.
        """
        if to_instance is None:
            return None

            return cls(
            id=getattr(to_instance, 'id', None),
            created_by=to_instance.created_by,
            created_at=to_instance.created_at,
            updated_by=to_instance.updated_by,
            updated_at=to_instance.updated_at,
        )

    class Meta:
        abstract = True
