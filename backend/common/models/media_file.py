from django.db import models, transaction

from common.helpers.utils import convert_field
from common.models.base_model import BaseModel


class MediaFile(models.Model, BaseModel):
    """
    Model to store metadata about uploads files, including their URLs.
    """

    MEDIA_TYPES = (
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('document', 'Document'),
        ('other', 'Other'),
    )

    title = models.CharField(max_length=1000)
    description = models.TextField(blank=True, null=True)
    file_url = models.URLField(max_length=2000)
    media_type = models.CharField(max_length=20, choices=MEDIA_TYPES)
    file_size = models.FloatField(blank=True, null=True, help_text="File size in bytes.")
    file_format = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        """Table's metadata"""
        db_table = 'media_file'
        verbose_name = "Media File"
        verbose_name_plural = "Media Files"

    @classmethod
    def from_to(cls, media_file_to, update: bool = False):
        """
        Creates a MediaFile instance from an MediaFileTO instance without saving it.

        Args:
            media_file_to (MediaFileTO): Transfer Object containing the MediaFile data.

        Returns:
            MediaFile: An instance of the MediaFile model.
        """
        from common.contract.to.media_file_to import MediaFileTO
        if not media_file_to:
            return None

        if isinstance(media_file_to, dict):
            media_file_to = MediaFileTO.from_dict(media_file_to)
        elif not isinstance(media_file_to, MediaFileTO):
            media_file_to = convert_field(media_file_to, MediaFileTO)

        update_or_create_defaults = {
            'title': media_file_to.title,
            'description': media_file_to.description,
            'file_url': media_file_to.file_url,
            'media_type': media_file_to.media_type,
            'file_size': media_file_to.file_size,
            'file_format': media_file_to.file_format,
        }

        with transaction.atomic():
            if update and media_file_to.id is not None and media_file_to.id > 0 and MediaFile.objects.filter(id=media_file_to.id).exists():
                MediaFile.objects.filter(id=media_file_to.id).update(
                    **update_or_create_defaults
                )
                media_file_instance = MediaFile.objects.get(id=media_file_to.id)
            else:
                media_file_instance = MediaFile.objects.create(
                    **update_or_create_defaults
                )

        return media_file_instance

# Example Usage
# Create a MediaFile instance:
# media_file = MediaFile.objects.create(
#     title="My Awesome Video",
#     description="A short video clip.",
#     file_url="https://example.com/videos/my_video.mp4",
#     media_type="video",
#     file_size = 1048576, # 1MB in bytes
#     file_format = "mp4"
# )

# Access the file URL:
# print(media_file.file_url)

# Access the uploads type:
# print(media_file.media_type)
