from django.db import models

from user_management.models.audit_model import AuditModel


class Note(AuditModel):
    """News model for managing automotive news, launches, and tests."""
    headline = models.CharField(max_length=200, blank=True)
    description = models.TextField(max_length=240, blank=True)
    lead = models.TextField(blank=True)
    body = models.TextField(blank=True)
    closure = models.TextField(blank=True,null=True)
    main_image = models.ForeignKey('common.MediaFile', blank=True, null=True, on_delete=models.SET_NULL)
    published = models.BooleanField(default=False)
    draft = models.BooleanField(default=False)
    videos = models.ManyToManyField(
        'common.MediaFile',
        blank=True,
        related_name='%(class)s_videos'
    )
    # The related_name will be 'news_images', 'releases_images', etc.
    images = models.ManyToManyField(
        'common.MediaFile',
        blank=True,
        related_name='%(class)s_images'
    )
    tags = models.ManyToManyField(
        'Tag',
        blank=True,
        related_name='%(class)s_tags'
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']

