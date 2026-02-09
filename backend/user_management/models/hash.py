"""This module contains the Audit model"""
import uuid

from django.db import models
from django.utils import timezone

class Hash(models.Model):
    """Hash model for CRM access tokens"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=120, db_index=True)
    value = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    expires_at = models.DateTimeField(
        null=False,
        db_index=True
    )
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        db_table = 'hash'
        indexes = [
            models.Index(fields=['key', 'is_active', 'expires_at']),
        ]