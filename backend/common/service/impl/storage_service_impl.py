"""This module contains the news service"""
import io
import os
import uuid

import boto3
from urllib.parse import urlparse
from PIL import Image
from botocore.exceptions import ClientError
from django.utils.text import slugify
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework.parsers import MultiPartParser
from app import settings
from common.exceptions.exceptions import BadRequestException, InternalServerErrorException
from common.helpers.query_options import QueryOptions
from common.helpers.utils import generate_random_10_digit_number
from common.service.storage_service import StorageService
from motor_insight.repository.impl.media_file_repository_impl import MediaFileRepositoryImpl


class StorageServiceImpl(StorageService):
    """Storage service"""



    def __init__(self):
        self.media_file_repository = MediaFileRepositoryImpl()
        self.s3_client = boto3.client('s3')
        self.s3_folder_prefix = 'uploads/images/'
        parser_classes = [MultiPartParser]

    def soft_delete_by_id(self, id):
        pass

    def restore_by_id(self, id):
        pass

    def get_all(self, **kwargs):
        pass

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs) -> dict:
        pass

    def get_by_id(self, obj_id):
        pass

    def _s3_object_exists(self, key):
        """Helper para verificar si un objeto existe en S3."""
        try:
            self.s3_client.head_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=key)
            return True
        except ClientError as e:
            if e.response['Error']['Code'] == '404':
                return False
            raise

    def upload_file(self, file, title, media_type=None,
                    overwrite=False):
        if not file:
            raise BadRequestException('No se pudo subir el archivo: Archivo no proporcionado.')
        if not title:
            title = f"imagen_{generate_random_10_digit_number()}"
        try:
            img = Image.open(file).convert("RGB")

            clean_title = title.replace('.webp', '')

            base_s3_key = f"{self.s3_folder_prefix}{slugify(clean_title)}.webp"
            final_s3_key = base_s3_key

            # 3. Si NO se permite overwrite, generamos un nombre único
            if not overwrite:
                # Check si ya existe en S3 y modificar nombre
                while self._s3_object_exists(final_s3_key):
                    unique_suffix = uuid.uuid4().hex[:8]
                    final_s3_key = f"{self.s3_folder_prefix}{slugify(clean_title)}-{unique_suffix}.webp"

            # 4. Convertir y guardar en buffer
            buffer = io.BytesIO()
            img.save(buffer, format="WEBP", quality=80)
            buffer.seek(0)  # Mover el cursor al inicio del buffer para leerlo

            webp_size = buffer.getbuffer().nbytes

            self.s3_client.upload_fileobj(
                buffer,
                settings.AWS_STORAGE_BUCKET_NAME,
                final_s3_key,
                ExtraArgs={
                    'ContentType': 'image/webp',
                }
            )
            file_url = f"{settings.STORAGE_URL}{final_s3_key}"
            return {
                'fileUrl': file_url,
                'fileSize': webp_size,
                'fileFormat': 'image/webp',
                'fileName': os.path.basename(final_s3_key)
            }

        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            print(f"Error de Boto3 al subir a S3: {error_code} - {error_message}")
            raise InternalServerErrorException(f"Error al subir el archivo a la nube")
        except Exception as e:
            # Capturar cualquier otra excepción inesperada
            print(f"Error inesperado al procesar y subir archivo: {str(e)}")
            raise InternalServerErrorException("Ocurrió un problema, por favor contacte a soporte.")

    def upload_file_v2(self, file, title, media_type=None, overwrite=False):
        if not file:
            raise BadRequestException('No se pudo subir el archivo: Archivo no proporcionado.')
        if not title:
            title = f"imagen_{generate_random_10_digit_number()}"

        try:
            # 1. Open the image
            img = Image.open(file)

            # Determine if it's a GIF
            is_gif = hasattr(file, 'content_type') and file.content_type == 'image/gif'
            if not is_gif and media_type:
                is_gif = media_type == 'image/gif'

            # For non-GIFs, convert to RGB
            if not is_gif:
                img = img.convert("RGB")

            # 2. Generate S3 key based on file type
            if is_gif:
                clean_title = title.replace('.gif', '').replace('.webp', '')
                base_s3_key = f"{self.s3_folder_prefix}{slugify(clean_title)}.gif"
            else:
                clean_title = title.replace('.webp', '')
                base_s3_key = f"{self.s3_folder_prefix}{slugify(clean_title)}.webp"

            final_s3_key = base_s3_key

            # 3. If overwrite is not allowed, generate unique name
            if not overwrite:
                # Check if it already exists in S3 and modify name
                while self._s3_object_exists(final_s3_key):
                    unique_suffix = uuid.uuid4().hex[:8]
                    if is_gif:
                        final_s3_key = f"{self.s3_folder_prefix}{slugify(clean_title)}-{unique_suffix}.gif"
                    else:
                        final_s3_key = f"{self.s3_folder_prefix}{slugify(clean_title)}-{unique_suffix}.webp"

            # 4. Convert and save to buffer
            buffer = io.BytesIO()

            if is_gif:
                # For GIFs, preserve animation
                img.save(buffer, format="GIF", save_all=True, optimize=False)
                content_type = 'image/gif'
                file_format = 'image/gif'
            else:
                # For other images, convert to WebP
                img = img.convert("RGBA")  # Convert to RGBA for WebP compatibility
                img.save(buffer, format="WEBP", quality=80)
                content_type = 'image/webp'
                file_format = 'image/webp'

            buffer.seek(0)  # Move cursor to beginning of buffer to read it
            file_size = buffer.getbuffer().nbytes

            # 5. Upload to S3
            self.s3_client.upload_fileobj(
                buffer,
                settings.AWS_STORAGE_BUCKET_NAME,
                final_s3_key,
                ExtraArgs={
                    'ContentType': content_type,
                }
            )

            file_url = f"{settings.STORAGE_URL}{final_s3_key}"

            return {
                'fileUrl': file_url,
                'fileSize': file_size,
                'fileFormat': file_format,
                'fileName': os.path.basename(final_s3_key)
            }

        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            print(f"Error de Boto3 al subir a S3: {error_code} - {error_message}")
            raise InternalServerErrorException(f"Error al subir el archivo a la nube")
        except Exception as e:
            # Capture any other unexpected exception
            print(f"Error inesperado al procesar y subir archivo: {str(e)}")
            raise InternalServerErrorException("Ocurrió un problema, por favor contacte a soporte.")

    def upload_file_to_directory(self, file, title, media_type, overwrite=False):
        if not file:
            raise BadRequestException('No se pudo subir el archivo')

        try:
            # 1. Abrir y convertir a RGB para asegurar compatibilidad Web
            img = Image.open(file).convert("RGB")
            title = title if '.webp' not in title else title.replace('.webp', '')
            # 2. Generar nombre base
            base_filename = f"{slugify(title)}.webp"
            final_filename = base_filename

            # 3. Si NO se permite overwrite, generamos un nombre único
            if not overwrite:
                # Check si ya existe y modificar nombre
                while default_storage.exists(final_filename):
                    unique_suffix = uuid.uuid4().hex[:8]
                    final_filename = f"{slugify(title)}-{unique_suffix}.webp"

            # 4. Convertir y guardar en buffer
            buffer = io.BytesIO()
            img.save(buffer, format="WEBP", quality=80)
            buffer.seek(0)

            # 5. Calcular tamaño del archivo
            webp_size = buffer.getbuffer().nbytes

            # 6. Guardar en almacenamiento configurado
            path = default_storage.save(final_filename, ContentFile(buffer.read()))
            file_url = default_storage.url(path)

            # 7. Devolver metadata
            return {
                'fileUrl': file_url,
                'fileSize': webp_size,
                'fileFormat': 'image/webp',
                'fileName': final_filename
            }
        except Exception as e:
            raise InternalServerErrorException("Ocurrió un problema, por favor contacte a soporte.")

    def upload_file_to_directory_v2(self, file, title, media_type, overwrite=False):
        if not file:
            raise BadRequestException('No se pudo subir el archivo')
        try:
            # 1. Open the image
            img = Image.open(file)

            # For GIFs, don't convert to RGB to preserve animation
            if file.content_type != 'image/gif':
                img = img.convert("RGB")

            # 2. Generate base filename - Clean title first, then add proper extension
            if file.content_type == 'image/gif':
                # Remove any existing extensions from title
                clean_title = title.replace('.gif', '').replace('.webp', '')
                base_filename = f"{clean_title}.gif"
            else:
                # Remove any existing extensions from title
                clean_title = title.replace('.webp', '').replace('.gif', '')
                base_filename = f"{clean_title}.webp"

            final_filename = base_filename

            if not overwrite:
                # Check if already exists and modify the filename accordingly
                while default_storage.exists(final_filename):
                    unique_suffix = uuid.uuid4().hex[:8]
                    if file.content_type == 'image/gif':
                        final_filename = f"{clean_title}-{unique_suffix}.gif"
                    else:
                        final_filename = f"{clean_title}-{unique_suffix}.webp"

            # 4. Convert and save to buffer
            buffer = io.BytesIO()

            if file.content_type == 'image/gif':
                # For GIFs, save with all frames to preserve animation
                img.save(buffer, format="GIF", save_all=True, optimize=False,overwrite=overwrite)
            else:
                # Convert to RGBA for WebP compatibility
                img = img.convert("RGBA")
                img.save(buffer, format="WEBP", quality=80,overwrite=overwrite)

            buffer.seek(0)

            # 5. Calculate file size
            file_size = buffer.getbuffer().nbytes

            # 6. Save to configured storage
            path = default_storage.save(final_filename, ContentFile(buffer.read()))
            file_url = default_storage.url(path)

            # 7. Return metadata
            return {
                'fileUrl': file_url,
                'fileSize': file_size,
                'fileFormat': file.content_type,
                'fileName': final_filename
            }
        except Exception as e:
            raise InternalServerErrorException("Ocurrió un problema, por favor contacte a soporte.")

    def delete_file_from_storage_bulk(self, file_paths: list[str]) -> bool:
        if file_paths.__len__() > 0:
            for file_path in file_paths:
                self.delete_file_from_storage(file_path)
            return True
        return False

    def delete_by_id(self, id):
        file = self.media_file_repository.get_by_id(id)
        if not file:
            raise BadRequestException('No se pudo encontrar el archivo')
        self.media_file_repository.delete_by_id(id)
        self.delete_file_from_storage(file.file_url)
        return True

    def delete_file_from_directory(self, file_path: str) -> bool:
        """
        Deleta a file from storage(example: 'media_uploads/nombre.webp').
        returns true if exists false is not.
        """
        if not file_path or file_path == '':
            return False
        parsed = urlparse(file_path)
        relative_path = parsed.path.replace(settings.MEDIA_URL, '', 1)  # Ej: 'media_uploads/archivo.webp'
        path = settings.MEDIA_ROOT + "/" + relative_path
        try:
            if default_storage.exists(path):
                default_storage.delete(path)
                return True
        except Exception as e:
            print(f"Error al intentar eliminar archivo desde almacenamiento: {str(e)}")
        return False

    def delete_file_from_storage(self, file_identifier):
        """
        Elimina un archivo de S3 dada su clave (key) o su URL completa.

        Args:
            file_identifier (str): El nombre del archivo (key S3) o la URL completa del archivo en S3.

        Returns:
            bool: True si el archivo fue eliminado exitosamente o no existía.
            (Retorna False o levanta una excepción si hay un problema de permisos o de conexión).

        Raises:
            BadRequestException: Si el identificador no es válido o no se puede parsear.
            InternalServerErrorException: Si ocurre un error al comunicarse con S3.
        """
        if settings.ENV == 'DEVELOPMENT':
            return self.delete_file_from_directory(file_identifier)
        s3_key_to_delete = None
        if file_identifier.startswith(settings.STORAGE_URL):
            s3_key_to_delete = file_identifier.replace(settings.STORAGE_URL, '', 1)
            if not s3_key_to_delete.startswith(self.s3_folder_prefix):
                print(
                    f"Advertencia: La URL '{file_identifier}' no tiene el prefijo de carpeta esperado: '{self.s3_folder_prefix}'")
        else:
            if not file_identifier.startswith(self.s3_folder_prefix) and '/' not in file_identifier:
                s3_key_to_delete = f"{self.s3_folder_prefix}{file_identifier}"
            else:
                s3_key_to_delete = file_identifier

        if not s3_key_to_delete:
            raise BadRequestException(
                "No se pudo determinar la clave de S3 a partir del identificador proporcionado.")

        print(f"Intentando eliminar objeto S3 con clave: {s3_key_to_delete}")  # Para depuración

        try:
            if not self._s3_object_exists(s3_key_to_delete):
                print(f"El objeto {s3_key_to_delete} no existe en S3. No hay nada que eliminar.")
                return True

            self.s3_client.delete_object(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                Key=s3_key_to_delete
            )
            print(f"Objeto {s3_key_to_delete} eliminado exitosamente de S3.")
            return True

        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            print(f"Error de Boto3 al eliminar de S3: {error_code} - {error_message}")
            raise InternalServerErrorException(f"Error al eliminar del almacenamiento de imagenes")
        except Exception as e:
            print(f"Error inesperado al intentar eliminar archivo: {str(e)}")
            raise InternalServerErrorException("Ocurrió un problema, por favor contacte a soporte.")

    def update(self, obj_id, data):
        pass

    def create(self, data):
        pass
