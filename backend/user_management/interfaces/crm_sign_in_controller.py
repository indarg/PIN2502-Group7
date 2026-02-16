"""Contains the sign in controller"""

from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success, api_response_error
from common.serializer.CamelCaseMixin import to_snake_case_data
from user_management.contract.io.sign_in_in import SignInIn
from user_management.interfaces.check_hash_controller import require_crm_hash
from user_management.service.impl.user_service_impl import UsersServiceImpl
import logging

from user_management.utils.crm_hash_manager import CRMHashManager

logger = logging.getLogger(__name__)
@api_view(["POST"])
@require_crm_hash
def crm_sign_in_controller(request, hash):
    """Controller for CRM signin with email and password"""
    try:
        # Verify hash with request context for better logging/rate limiting

        user_service = UsersServiceImpl()
        sign_in_in = SignInIn(data=to_snake_case_data(request.data))

        # Log successful CRM login attempt
        logger.info(f"CRM login attempt for hash verification from IP: {request.META.get('REMOTE_ADDR', 'unknown')}")

        result = user_service.sign_in(sign_in_in)

        # Log successful CRM login
        if result and hasattr(result, 'get') and result.get('user'):
            logger.info(f"Successful CRM login for user: {result['user'].get('email', 'unknown')}")

        return api_response_success(
            "Usuario autenticado",
            result,
            status.HTTP_200_OK
        )

    except Exception as e:
        logger.error(f"CRM signin failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'unknown')}")
        return api_response_error(str(e), status.HTTP_403_FORBIDDEN)