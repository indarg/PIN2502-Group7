from django.urls import path
from user_management.interfaces.crm_refresh_session_controller import crm_refresh_session_controller
from user_management.interfaces.crm_sign_in_controller import crm_sign_in_controller
from user_management.interfaces.crm_token_verification_controller import crm_token_verification_controller
from user_management.interfaces.crm_verify_session_controller import crm_verify_session_controller
from user_management.interfaces.update_user_profile_controller import update_user_profile_controller

urlpatterns = [
    path("users/sign-in", crm_sign_in_controller, name="crm_sign_in_controller"),
    path("users/verify", crm_verify_session_controller, name="crm_verify_session_controller"),
    path("users/refresh-session", crm_refresh_session_controller, name="crm_refresh_session_controller"),
    path("users/update-profile/<str:id>", update_user_profile_controller, name="update_user_profile_controller"),
    path("users/token", crm_token_verification_controller, name="crm_token_verification_controller"),

]
