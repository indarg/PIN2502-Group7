'''This module contains the User Transfer Object'''
from dataclasses import dataclass
from typing import Optional

from common.contract.to.base_to import BaseTO
from common.contract.to.media_file_to import MediaFileTO
from user_management.models.user import User


@dataclass
class UserTO(BaseTO):
    id: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    profileImage: Optional[MediaFileTO] = None

    @classmethod
    def from_model(cls, instance: User) -> 'UserTO | None':
        """Transforms User instance into a UserTO representation."""
        if instance is None:  # Handle case when instance is None
            return None
        return cls(
            id=instance.id,
            first_name=instance.first_name,
            last_name=instance.last_name,
            email=instance.email,
            profileImage=MediaFileTO.from_model(instance.profile_image)
        )
