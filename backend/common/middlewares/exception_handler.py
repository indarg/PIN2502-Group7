"""Module for handling the exceptions"""
import logging
import traceback

from coverage.report_core import render_report
from django.utils.deprecation import MiddlewareMixin
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from common.exceptions.exceptions import (
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
)
from common.helpers.api_responses import api_response_error

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(name)s - %(message)s')
logger = logging.getLogger(__name__)


class ExceptionHandler(MiddlewareMixin):
    """Handles the exceptions to avoid handling it within the app"""

    def process_exception(self, _request, exception):
        """Process the exception and return a proper response"""
        exception_traceback = traceback.format_exc()

        response = api_response_error(
            "Ha ocurrido un problema. Intente nuevamente o contacte a soporte",
            str(exception),
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

        if isinstance(exception, BadRequestException):
            response = api_response_error(
                exception.message, exception.errors, status.HTTP_400_BAD_REQUEST
            )
        elif isinstance(exception, UnauthorizedException):
            response = api_response_error(
                exception.message, exception.errors, status.HTTP_401_UNAUTHORIZED
            )
        elif isinstance(exception, ForbiddenException):
            response = api_response_error(
                exception.message, exception.errors, status.HTTP_403_FORBIDDEN
            )
        elif isinstance(exception, NotFoundException):
            response = api_response_error(
                exception.message, exception.errors, status.HTTP_404_NOT_FOUND
            )
        elif isinstance(exception, ConflictException):
            response = api_response_error(
                exception.message, exception.errors, status.HTTP_409_CONFLICT
            )
        elif isinstance(exception, InternalServerErrorException):
            response = api_response_error(
                "Ha ocurrido un problema, por favor inténtelo nuevamente o contacte a soporte",
                exception.errors,
                status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.error("Exception occurred")
        if hasattr(exception, 'message'):
            logger.error(f"Error Message: {exception.message}")

        if hasattr(exception, 'errors'):
            logger.error(f"Error Details (Errors attribute): {exception.errors}")
        logger.error("Traceback details:\n%s", exception_traceback)

        return self.render_response(response)

    @staticmethod
    def render_response(response):
        """Renders the response"""
        response.accepted_renderer = JSONRenderer()
        response.accepted_media_type = "application/json"
        response.renderer_context = {}
        response.render()
        return response
