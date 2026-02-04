"""This module contains the crm_urls related with analysis stuff"""

from django.urls import path, include

from user_management.interfaces.get_users_controller import get_users_controller
from user_management.interfaces.sign_in_controller import sign_in_controller

urlpatterns = [
    path('crm/<str:hash>/', include('user_management.crm_urls'))

]
