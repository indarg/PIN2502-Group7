"""This module contains the user service"""
from abc import ABC, abstractmethod

from common.helpers.query_options import QueryOptions
from motor_insight.contract.refresh_session import RefreshTokenIn
from user_management.contract.io.sign_in_in import SignInIn
from user_management.contract.io.sign_up_in import SignUpIn
from user_management.contract.io.update_profile_in import UpdateProfileIn

class UsersService(ABC):
    """User service"""

    @abstractmethod
    def get_users(self, query_options: QueryOptions):
        """Retrieves the users"""

    @abstractmethod
    def sign_up(self, sign_up_in: SignUpIn):
        """Create a new user"""

    @abstractmethod
    def sign_in(self, sign_in_in: SignInIn):
        ("""Log-in a user""")

    @abstractmethod
    def sign_in_crm(self, sign_in_in: SignInIn):
        """Log-in a user"""

    @abstractmethod
    def update_profile(self, user_id: str, user_profile_in: UpdateProfileIn):
        """Retrieve a user by their ID"""

    @abstractmethod
    def verify_token(self, auth_header):
        """Validate the user's token"""

    @abstractmethod
    def verify_temporary_token(self,user_id, token):
        """Validate the user's token"""

    @abstractmethod
    def refresh_token(self, refresh_token: RefreshTokenIn):
        """Refresh the user's token"""
