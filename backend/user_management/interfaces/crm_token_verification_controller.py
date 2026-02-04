"""Contains the sign in controller"""

from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from user_management.interfaces.check_hash_controller import require_crm_hash
from user_management.service.impl.user_service_impl import UsersServiceImpl


@api_view(["POST"])
@require_crm_hash
def crm_token_verification_controller(request, hash):
    """Controller for signin in with email and password"""

    user_service = UsersServiceImpl()
    token = request.data["token"]
    user_id = request.data["user_id"]
    return api_response_success(
        "Usuario autenticado", user_service.verify_temporary_token(user_id,token), status.HTTP_200_OK
    )
