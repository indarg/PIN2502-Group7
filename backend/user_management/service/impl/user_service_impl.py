"""Contains the users service"""

from tokenize import TokenError

from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken

from app import settings
from common.exceptions.exceptions import (
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
)
from common.helpers import jwt_utils
from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions
from common.helpers.utils import generate_random_six_digit_string_v1
from common.repository.email_repository import EmailRepository
from common.serializer.CamelCaseMixin import to_camelcase_data
from motor_insight.contract.refresh_session import RefreshTokenIn
from user_management.contract.io.sign_in_in import SignInIn
from user_management.contract.io.sign_up_in import SignUpIn
from user_management.contract.to.user_to import UserTO
from user_management.models import UserToken, User
from user_management.repository.impl.user_repository_impl import UserRepositoryImpl
from user_management.service.users_service import UsersService
from user_management.contract.io.update_profile_in import UpdateProfileIn
from common.models.media_file import MediaFile
from common.contract.to.media_file_to import MediaFileTO
class UsersServiceImpl(UsersService):
    """Business logic for user management"""

    def sign_in_crm(self, sign_in_in: SignInIn):
        pass

    def __init__(self):
        self.repository = UserRepositoryImpl()
        self.email_repository = EmailRepository()
    
    def update_profile(self, user_id: str, user_profile_in: UpdateProfileIn):
        """Business logic to update user profile"""
        if not user_profile_in.is_valid():
            print(user_profile_in.errors)
            raise BadRequestException("Todos los campos son requeridos", user_profile_in.errors)
        data = user_profile_in.validated_data
        user_to = UserTO.from_model(self.repository.get_by_id(user_id))
        user_to.first_name = data.get("first_name", user_to.first_name)
        user_to.last_name = data.get("last_name", user_to.last_name)
        media_file = MediaFileTO()
        media_file.id = data.get("profile_image", {}).get("id", None)
        media_file.file_url = data.get("profile_image", {}).get("file_url", None)
        media_file.title = data.get("profile_image", {}).get("title", None)
        media_file.file_size = data.get("profile_image", {}).get("file_size", None)
        media_file.media_type = data.get("profile_image", {}).get("media_type", None)
        media_file.file_format = data.get("profile_image", {}).get("file_format", None)
        user_profile_img = MediaFile.from_to(media_file)
        user_to.profile_image = user_profile_img

        # Update the user profile in the repository
        updated_user = self.repository.update_user_profile(user_to)
        if not updated_user:
            raise NotFoundException("Usuario no encontrado")

        return to_camelcase_data(updated_user.to_dict())

    def get_users(self, query_options: QueryOptions):
        """Business logic to retrieve all users"""
        users = self.get_users_uc.exec(self.repository, query_options)
        if not users:
            raise NotFoundException("Users not found")
        return [user.to_dict() for user in users]

    def sign_up(self, sign_up_in: SignUpIn):
        """Business logic to sign up user"""
        if not sign_up_in.is_valid():
            raise BadRequestException("All fields are mandatory", sign_up_in.errors)
        data = sign_up_in.validated_data
        if (
                self.get_user_by_filters.exec(self.repository, email=data["email"])
                is not None
        ):
            raise BadRequestException("User already exists", None)
        self.sign_up_uc.exec(self.repository, **data)

    def sign_in(self, sign_in_in: SignInIn):
        """Business logic to sign in"""
        if not sign_in_in.is_valid():
            raise BadRequestException("All fields are mandatory", sign_in_in.errors)
        data = sign_in_in.validated_data
        user = User.objects.filter(email=data['email']).first()
        if user.failed_login_attempts >= 5:
            user.is_active = False
            user.save()
            raise BadRequestException("Ha excedido el numero de intentos de login")
        if not user or not user.is_active:
            raise UnauthorizedException("Usuario no activo")
        if not user.check_password(data['password']):
            user.failed_login_attempts += 1
            user.save()
            raise BadRequestException("Credenciales invalidas")

        # Create JWT tokens with custom claims
        refresh = RefreshToken.for_user(user)

        # Add email to the access token payload
        access_token = refresh.access_token
        access_token['email'] = user.email  # Add email to token payload

        # Convert to string
        access_token_str = str(access_token)

        UserToken.objects.filter(user_id=user.id).delete()
        new_temporary_token = generate_random_six_digit_string_v1()

        # Fix the typo: user.emal -> user.email
        full_name = user.first_name + user.last_name if user.first_name is not None and user.last_name is not None else user.email

        if settings.ENV == 'DEVELOPMENT':
            print('sending email mock')
        else:
            self.email_repository.send_new_token_email(user.email, full_name, new_temporary_token)

        UserToken.objects.create(user=user, token=new_temporary_token)

        # Return the access token and refresh token
        return {
            'accessToken': access_token_str,
            'refreshToken': str(refresh),
            'user': to_camelcase_data(UserTO.from_model(user).to_dict())
        }

    def refresh_token(self, refresh_token: RefreshTokenIn):
        """Business logic to process refresh token securely"""
        if not refresh_token.is_valid():
            raise BadRequestException("Refresh token is required.")
        token_str = refresh_token.validated_data.get("refresh_token")
        email = refresh_token.validated_data.get("email")
        if not email:
            raise BadRequestException("Email is required.")
        try:
            refresh = RefreshToken(token_str)
            user_id = refresh.payload.get("user_id")
            if not user_id:
                raise UnauthorizedException("Invalid token payload.")

            user = UserRepositoryImpl().get_user_by_filters(id=user_id)
            if not user:
                raise UnauthorizedException("User associated with token not found.")
            if user.email.lower() != email.lower():
                raise UnauthorizedException("Email does not match the token owner.")
            access_token = str(refresh.access_token)

            return {
                "accessToken": access_token,
                "user": user.to_dict()
            }

        except TokenError:
            raise UnauthorizedException("Invalid or expired refresh token.")

    def verify_token(self, auth_header):
        """Business logic to verify token"""
        if not auth_header or not auth_header.startswith("Bearer "):
            # Return false if the token is missing or improperly formatted
            raise UnauthorizedException("Unauthorized", {"is_authenticated": False})

        # Extract the token part from the header
        token = auth_header.split(" ")[1]

        # Instantiate JWTAuthentication to validate the token
        jwt_auth = JWTAuthentication()

        try:
            jwt_auth.get_validated_token(token)
            return api_response_success(
                "Is authenticated", {"isAuthenticated": True}, status.HTTP_200_OK
            )
        except (InvalidToken, TokenError) as e:
            raise UnauthorizedException(
                "Session expired", {"is_authenticated": False}
            ) from e

    def verify_temporary_token(self,user_id,token):
        user_token = UserToken.get_and_check_token(user_id,token)
        user_token.delete()
        return True
