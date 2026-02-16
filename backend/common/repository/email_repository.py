from django.core.mail import send_mail
from django.conf import settings
import datetime

from django.template.loader import render_to_string
from django.utils.html import strip_tags

from common.exceptions.exceptions import InternalServerErrorException


class EmailRepository:

    def __init__(self):
        pass

    def send_email_example(self, recipient_email:str):
        try:
            send_mail(
                'Asunto de Prueba',
                'Este es un mensaje de prueba desde tu Django VPS con Gmail SMTP.',
                settings.DEFAULT_FROM_EMAIL,
                [recipient_email],
                fail_silently=False,
            )
            print(f"Correo enviado exitosamente a {recipient_email} desde {settings.DEFAULT_FROM_EMAIL}")
        except Exception as e:
            print(f"Error al enviar el correo: {e}")
            raise InternalServerErrorException("Error al enviar el correo")

    def send_new_hash_email(self,user_email, user_name, activation_url):
        subject = '¡Nuevo link de ingreso!'

        context = {
            'user_name': user_name,
            'activation_link': activation_url,
            'logo_url': settings.CLIENT_URL+'/media/m-logo.png',
            'current_year': datetime.datetime.now().year,
        }

        # Renderiza el template HTML
        html_message = render_to_string('./templates/new_hash_template.html', context)

        # Genera una versión de texto plano (muy importante para la accesibilidad y anti-spam)
        plain_message = strip_tags(html_message)  # Elimina las etiquetas HTML

        try:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                html_message=html_message,
                fail_silently=False,
            )
            print(f"Correo HTML enviado exitosamente a {user_email}")
        except Exception as e:
            print(f"Error al enviar el correo HTML: {e}")

    def send_new_token_email(self,user_email, user_name, token):
        subject = '¡Token de inicio de sesión!'

        context = {
            'user_name': user_name,
            'token': token,
            'logo_url': settings.CLIENT_URL+'/media/m-logo.png',
            'current_year': datetime.datetime.now().year,
        }

        html_message = render_to_string('./templates/new_token_template.html', context)

        plain_message = strip_tags(html_message)

        try:
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                html_message=html_message,
                fail_silently=False,
            )
            print(f"Correo HTML enviado exitosamente a {user_email}")
        except Exception as e:
            raise InternalServerErrorException("Error al enviar el correo con el token de verificación")
            print(f"Error al enviar el correo con token HTML: {e}")