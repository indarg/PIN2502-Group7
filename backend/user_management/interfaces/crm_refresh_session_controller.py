"""Contains the sign in controller"""

from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from common.serializer.CamelCaseMixin import to_snake_case_data
from motor_insight.contract.refresh_session import RefreshTokenIn
from user_management.interfaces.check_hash_controller import require_crm_hash
from user_management.service.impl.user_service_impl import UsersServiceImpl
from user_management.utils.hash_utils import verify_hash


@api_view(["POST"])
@require_crm_hash
def crm_refresh_session_controller(request, hash):
    """Refresh session controller"""
    refresh_token = RefreshTokenIn(data=to_snake_case_data(request.data))
    user_service = UsersServiceImpl()

    return api_response_success(
        "Usuario autenticado", user_service.refresh_token(refresh_token), status.HTTP_200_OK
    )
