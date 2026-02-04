"""Contains the middleware for user authentication"""
import re
from django.http import JsonResponse
from rest_framework.renderers import JSONRenderer
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken

from common.exceptions.exceptions import UnauthorizedException
from common.helpers.api_responses import api_response_error
from user_management.models.user import User


class JWTMiddleware:
    """Authenticate the user"""

    def __init__(self, get_response):
        self.get_response = get_response

        # Rutas que están explícitamente excluidas de la autenticación.
        self.EXCLUDED_PATHS = {
            '/',
            '/sitemap.xml',
            '/mw-server/v1/motor-insight/global-search/',
            '/mw-server/v1/user-management/users/',
            '/mw-server/v1/csrf',
            '/mw-server/v1/user-management/sign-up',
            '/mw-server/v1/user-management/users',
            '/mw-server/v1/user-management/token-refresh',
            '/mw-server/v1/user-management/session-verify',
            '/favicon.ico',
            # Rutas de API base que son públicas
            '/mw-server/v1/motor-insight/news/',
            '/mw-server/v1/motor-insight/releases/',
            '/mw-server/v1/motor-insight/teasers/',
            '/mw-server/v1/motor-insight/tags/',
            '/mw-server/v1/motor-insight/yt-videos/',
            '/mw-server/v1/motor-insight/advertisements/',
        }

        # Prefijos de rutas que también están excluidos.
        self.EXCLUDED_PREFIXES = {
            '/uploads/',
            '/mw-server/v1/hash',
        }

        # Sufijos de rutas que también están excluidos.
        self.EXCLUDED_SUFFIXES = {
            '/sign-in',
            '/refresh-session',
            '/users/token',
        }

        # Rutas dinámicas que son públicas (ej. news/19), pero sus sub-rutas /crm no lo son
        self.PUBLIC_DYNAMIC_ROUTES = {
            '/mw-server/v1/motor-insight/news/',
            '/mw-server/v1/motor-insight/releases/',
            '/mw-server/v1/motor-insight/teasers/',
            '/mw-server/v1/motor-insight/advertisements/',
        }

    def _is_path_excluded(self, path):
        """Helper to check if the path is in any of the excluded lists"""
        # Verificación de rutas de API públicas base, exactas, prefijos y sufijos
        if (
            path in self.EXCLUDED_PATHS or
            any(path.startswith(p) for p in self.EXCLUDED_PREFIXES) or
            any(path.endswith(s) for s in self.EXCLUDED_SUFFIXES)
        ):
            return True

        # Lógica para rutas dinámicas
        for dynamic_base in self.PUBLIC_DYNAMIC_ROUTES:
            if path.startswith(dynamic_base):
                # La ruta comienza con una de las bases dinámicas.
                # Ahora verificamos si es la ruta /crm/
                # Eliminamos el trailing slash para la comparación
                cleaned_path = path.strip('/')

                # Ejemplo: Si path es '/mw-server/v1/motor-insight/news/crm/'
                #         y dynamic_base es '/mw-server/v1/motor-insight/news/'
                # Entonces,cleaned_path.startswith('crm') será True.
                if cleaned_path.startswith(dynamic_base.strip('/') + '/crm'):
                    # Es una ruta de CRM, NO debe ser excluida.
                    return False

                # Si no es una ruta de CRM, asumimos que es una ruta dinámica de lectura
                # (ej. /news/19) y la excluimos de la autenticación.
                # Nota: la ruta base ya está en EXCLUDED_PATHS, así que esto solo
                # cubre las rutas con un ID.
                return True

        return False

    def __call__(self, request):
        if self._is_path_excluded(request.path):
            return self.get_response(request)

        auth_header = request.headers.get('Authorization')

        if not auth_header:
            response = api_response_error(
                message="No esta autorizado para realizar esta acción",
                status_code=401,
            )
            return self.render_response(response)
        try:
            prefix, token = auth_header.split()
            if prefix.lower() != "bearer":
                response = api_response_error(
                    message="No esta autorizado para realizar esta acción",
                    status_code=401,
                )
                return self.render_response(response)
            decoded_token = AccessToken(token)
            request.user = User.objects.get(id=decoded_token['user_id'],email=decoded_token['email'])

        except (TokenError, InvalidToken) as e:
            response = api_response_error(
                message="No esta autorizado para realizar esta acción",
                status_code=401,
            )
            return self.render_response(response)
        return self.get_response(request)

    @staticmethod
    def render_response(response):
        """Renders the response"""
        response.accepted_renderer = JSONRenderer()
        response.accepted_media_type = "application/json"
        response.renderer_context = {}
        response.render()
        return response