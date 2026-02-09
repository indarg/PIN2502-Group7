import os

import jwt
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

from common.exceptions.exceptions import ForbiddenException
from user_management.models import User


class CRMJWTMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if "/crm/" not in request.path or request.path.endswith("/sign-in"):
            return self.get_response(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return ForbiddenException("Token requerido")

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, os.getenv('JWT_CRM_SECRET'), algorithms=["HS256"])
            if payload.get("type") != "admin":
                raise jwt.InvalidTokenError("Tipo inválido")
            request.user = User.objects.get(id=payload['sub'])
            return self.get_response(request)
        except jwt.ExpiredSignatureError:
            return ForbiddenException("Token requerido")
        except jwt.InvalidTokenError as e:
            return ForbiddenException("Token invalido")
