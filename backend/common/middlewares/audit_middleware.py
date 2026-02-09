"""AuditMiddleware"""
import threading

_request_local = threading.local()


class AuditMiddleware:
    """Middleware to track the user making changes in models."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _request_local.user = request.user if request.user.is_authenticated else None
        response = self.get_response(request)
        return response


def get_current_user():
    return getattr(_request_local, "user", None)
