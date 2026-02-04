

from django.urls import path

from common.interfaces.delete_file_controller_by_file_name import delete_file_controller_by_file_name
from common.interfaces.delete_file_controller_by_file_name_bulk import delete_file_controller_by_file_name_bulk
from common.interfaces.delete_file_controller_by_id import delete_file_controller_by_id
from common.interfaces.upload_file_controller import uploaded_file_controller

urlpatterns = [
    path("upload/", uploaded_file_controller, name="uploaded_file_controller"),
    path("delete/id/<str:id>", delete_file_controller_by_id, name="delete_file_controller_by_id"),
    path("delete/filename", delete_file_controller_by_file_name, name="delete_file_controller_by_file_name"),
    path("delete/filename/bulk", delete_file_controller_by_file_name_bulk, name="delete_file_controller_by_file_name_bulk")
]
