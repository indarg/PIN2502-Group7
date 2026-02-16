from rest_framework import status
from rest_framework.decorators import api_view
from common.serializer.CamelCaseMixin import to_snake_case_data
from common.helpers.api_responses import api_response_success
from common.helpers.query_options import QueryOptions
from user_management.service.impl.user_service_impl import UsersServiceImpl
from user_management.contract.io.update_profile_in import UpdateProfileIn

@api_view(["PUT"])
def update_user_profile_controller(request,hash, id):
    """
    List all users and return them in UserTO format.
    """
    users_service = UsersServiceImpl()
    user_profile_in = UpdateProfileIn(data= to_snake_case_data(request.data))
    return api_response_success(
        "User profile updated successfully",
        users_service.update_profile(id, user_profile_in),
        status.HTTP_200_OK,
    )
