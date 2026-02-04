from functools import wraps
from django.shortcuts import redirect

from common.exceptions.exceptions import UnauthorizedException


def valid_role(*role_names):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated:
                if any(request.user.groups.filter(name=role_name).exists() for role_name in role_names):
                    return view_func(request, *args, **kwargs)
                else:
                    return view_func(request, *args, **kwargs)
            else:
                return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator
