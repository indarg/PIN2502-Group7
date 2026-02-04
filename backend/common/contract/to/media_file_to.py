from dataclasses import dataclass, asdict
from typing import Dict, TypeVar, Type, List, Any
from typing import Optional

from common.contract.to import BaseTO
from common.models.media_file import MediaFile

T = TypeVar("T", bound="MediaFileTO")

@dataclass
class MediaFileTO(BaseTO):
    """MediaFile TO"""
    id: int | None = None
    title: str = ''
    description: str = ''
    file_url: str = ''
    media_type: str = ''
    file_size: Optional[float] = None
    file_format: Optional[str] = None


    @classmethod
    def from_model(cls, instance: Optional[MediaFile]) -> Optional["MediaFileTO"]:
        """Transforms MediaFile instance into a MediaFileTO representation."""
        if instance is None:
            return None
        return cls(
            id=instance.id,
            title=instance.title,
            description=instance.description,
            file_url=instance.file_url,
            media_type=instance.media_type,
            file_size=instance.file_size,
            file_format=instance.file_format,
        )


    @classmethod
    def from_models(cls: Type[T], models: List[Any]) -> List[T]:
        """
        Transform a list of model instances into a list of TO instances.
        """
        if not models:
            return []
        return [cls.from_model(model) for model in models]

# Example Usage
# media_file = MediaFile(
#     title="My Awesome Video",
#     description="A short video clip.",
#     file_url="https://example.com/videos/my_video.mp4",
#     media_type="video",
#     file_size = 1048576, # 1MB in bytes
#     file_format = "mp4"
# )

# media_file_to = MediaFileTO.from_model(media_file)

# if media_file_to:
#     print(media_file_to)
# else:
#     print("Media file was None")
