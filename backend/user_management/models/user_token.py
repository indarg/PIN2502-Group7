from datetime import timedelta

from django.db import models
from django.utils import timezone

from common.exceptions.exceptions import InternalServerErrorException, BadRequestException
from common.models.base_model import BaseModel


class UserToken(models.Model, BaseModel):
    """
    Model to store user token signin.
    """
    user = models.ForeignKey('user_management.User', on_delete=models.SET_NULL,
                             null=True, blank=False)
    token = models.CharField(max_length=6, blank=False, null=False)
    date_limit = models.DateTimeField(default=timezone.now)

    class Meta:
        """Table's metadata"""
        db_table = 'user_token'

    def from_to(cls, issue_to):
        pass

    def is_expired(self):
        """
        Comprueba si el token ha expirado (más de 3 minutos desde su creación).
        """
        # Calcular el momento en que el token expira
        expiration_time = self.date_limit + timedelta(minutes=3)
        # Comprobar si la hora actual es posterior al momento de expiración
        return timezone.now() > expiration_time

        # Método de clase para obtener y verificar un token por su valor

    @classmethod
    def get_and_check_token(cls, user_id,token_value):
        """
        Busca un UserToken por su valor y comprueba si no está expirado.
        Retorna el UserToken si es válido y no expirado, de lo contrario None.
        """
        try:
            # Buscar el token
            user_token = cls.objects.get(user_id= user_id,token=token_value)

            if user_token.is_expired():
                raise BadRequestException(f"Token '{token_value}' encontrado pero está expirado.")
                print(f"Token '{token_value}' encontrado pero está expirado.")
            else:
                print(f"Token '{token_value}' encontrado y es válido.")
                return user_token
        except cls.DoesNotExist:
            raise BadRequestException("Token no encontrado")
        except Exception as e:
            raise InternalServerErrorException(f"Error al buscar o verificar el token '{token_value}'")
