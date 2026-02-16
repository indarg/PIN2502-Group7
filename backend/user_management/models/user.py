"""This module contains the user model"""

from django.contrib.auth.models import AbstractUser
from django.db import models, transaction

from common.models.base_model import BaseModel
from common.models.media_file import MediaFile


class User(AbstractUser, BaseModel):
    """User model"""
    profile_image = models.ForeignKey(MediaFile, blank=True, null=True, on_delete=models.SET_NULL)
    failed_login_attempts = models.IntegerField(default=0)
    class Meta:
        db_table = 'user'

    @classmethod
    def from_to(cls, user_to):
        """
        Creates or updates a User instance from a UserTO instance.

        Args:
            user_to (UserTO): Transfer Object containing the User data.

        Returns:
            User: An instance of the User model.
        """
        from user_management.contract.to.user_to import UserTO

        if user_to is None:
            return None

        if not isinstance(user_to, UserTO):
            raise ValueError("The argument must be an instance of UserTO")

        # Build the defaults dictionary
        defaults = {
            "name": user_to.name,
            "lastname": user_to.lastname,
            "email": user_to.email,
            "profile_image": user_to.profileImage,
        }

        # Filter out None values to avoid overwriting existing data
        defaults = {key: value for key, value in defaults.items() if value is not None}

        with transaction.atomic():
            # Update or create the User instance
            user_instance, created = cls.objects.update_or_create(
                id=user_to.id,  # Match by ID if provided
                defaults=defaults,
            )

        return user_instance
