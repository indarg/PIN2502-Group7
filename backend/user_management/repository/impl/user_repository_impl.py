"""Contains the user repository"""
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password


from common.helpers.query_options import QueryOptions
from user_management.models.user import User
from user_management.repository.user_repository import UserRepository
from user_management.contract.to.user_to import UserTO


class UserRepositoryImpl(UserRepository):
    """Contains the database access for user model"""

    def get_deleted_by_id(self, id):
        pass

    def soft_delete_by_id(self, id):
        pass

    def restore_by_id(self, id):
        pass

    def create_or_update(self, data, update):
        return super().create_or_update(data, update)

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs):
        pass

    def __init__(self):
        self.user = get_user_model()

    def update_user_profile(self, data):
        self.user.objects.filter(id=data.id).update(
            first_name=data.first_name,
            last_name=data.last_name,
            email=data.email,
            profile_image_id=data.profile_image.id,
        )
        return UserTO.from_model(self.user.objects.get(id=data.id))

    def get_user_by_filters(self, **kwargs):
        filters = {key: value for key, value in kwargs.items() if value is not None}
        users_found = self.user.objects.filter(**filters).first()
        return UserTO.from_model(users_found)

    def sign_up(self, name, lastname, email, password):
        return User.objects.create(
            lastname=lastname,
            name=name,
            email=email,
            password=make_password(password)
        )

    def get_user_by_email(self, email):
        user = self.user.objects.filter(email=email).first()
        return UserTO.from_model(user)

    def get_all(self, query_options: QueryOptions, **kwargs):
        users_query = self.user.objects.all().defer("password")

        return [] if not users_query or len(users_query) == 0 else UserTO.from_models(users_query)

    def get_by_id(self, obj_id):
        try:
            return self.user.objects.get(id=obj_id)
        except User.DoesNotExist:
            return None

    def delete_by_id(self, obj_id):
        try:
            user = self.user.objects.get(id=obj_id)
            user.delete()
            return True
        except User.DoesNotExist:
            return False

    def update(self, obj_id, data):
        try:
            user = self.user.objects.get(id=obj_id)
            for field, value in data.items():
                setattr(user, field, value)
            user.save()
            return user
        except User.DoesNotExist:
            return None

    def create_or_update(self, data, update:bool):
        """
        Add a new user to the database.
        """
        user = User.objects.create(**data)
        return user


    def check_password(self, user_id, password):
        user = User.objects.get(id=user_id)
        return check_password(password, user.password)
