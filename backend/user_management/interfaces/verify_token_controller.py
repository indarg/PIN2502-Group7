from rest_framework import status
from rest_framework.decorators import api_view

from common.helpers.api_responses import api_response_success
from user_management.interfaces.check_hash_controller import require_crm_hash
from user_management.service.impl.user_service_impl import UsersServiceImpl


@api_view(['GET'])
@require_crm_hash
def verify_refresh_token_controller(request,hash):
    """
    Endpoint to verify if the access token is valid.
    Returns a boolean indicating if the user is authenticated.
    """
    user_service = UsersServiceImpl()
    # Extract the token from the Authorization header
    auth_header = request.headers.get('Authorization', None)
    user_service.refresh_token(auth_header)
    return api_response_success("Is authenticated", {'isAuthenticated': True}, status.HTTP_200_OK)
