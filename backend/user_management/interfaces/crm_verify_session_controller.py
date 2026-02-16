"""Contains the sign in controller"""

from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from user_management.utils.crm_hash_manager import CRMHashManager


@api_view(["GET"])
def crm_verify_session_controller(request, hash):
    """Controller for verify the session when user visit LoginPage with a living session"""
    CRMHashManager.verify_hash(hash)

    return api_response_success(
        "Usuario autenticado", True, status.HTTP_200_OK
    )
