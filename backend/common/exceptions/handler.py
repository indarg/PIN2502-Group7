from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns DRF exceptions properly
    and wraps custom app exceptions with appropriate HTTP status.
    """

    response = exception_handler(exc, context)

    if response is not None:
        return response

    if hasattr(exc, "status_code"):
        return Response(
            {
                "message": exc.message,
                "errors": exc.errors,
            },
            status=exc.status_code,
        )

    return Response(
        {
            "message": "Ha ocurrido un problema. Intente nuevamente o contacte a soporte.",
            "errors": str(exc),
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
