from rest_framework import status
from rest_framework.decorators import api_view
import logging
from common.helpers.api_responses import api_response_success, api_response_error
from user_management.utils.crm_hash_manager import CRMHashManager
logger = logging.getLogger(__name__)


@api_view(['GET'])
def check_hash_controller(request, hash):
    """Controller to verify CRM access hash"""
    try:
        result = CRMHashManager.verify_hash(hash, request)

        return api_response_success(
            "Acceso válido",
            {"message": result, "valid": True},
            status.HTTP_200_OK
        )

    except Exception as e:
        logger.warning(f"Hash check failed: {str(e)} from IP: {request.META.get('REMOTE_ADDR', 'unknown')}")
        return api_response_error(
            str(e),
            status.HTTP_403_FORBIDDEN
        )

# Optional: Add a middleware-like decorator for hash checking on CRM routes
def require_crm_hash(view_func):
    """Decorator to require valid CRM hash for route access"""
    def wrapper(request, hash, *args, **kwargs):
        try:
            CRMHashManager.verify_hash(hash, request)
            return view_func(request, hash, *args, **kwargs)
        except Exception as e:
            logger.warning(f"CRM route access denied for hash {hash[:10]}... from IP: {request.META.get('REMOTE_ADDR', 'unknown')}")
            return api_response_error(str(e), status.HTTP_403_FORBIDDEN)
    return wrapper