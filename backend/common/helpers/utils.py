import typing
from typing import Any, Union
import random

def extract_type(field_type: Any):
    """Extracts the real type from Optional and Union types."""
    if typing.get_origin(field_type) is list:
        return typing.get_args(field_type)[0]
    if typing.get_origin(field_type) is Union:
        return next(t for t in typing.get_args(field_type) if
                    t is not type(None))
    return field_type


def convert_field(value: Any, field_type: Any):
    """Handles conversion of nested serializers to TOs."""
    if value is None:
        return None

    real_type = extract_type(field_type)

    if typing.get_origin(field_type) is list:
        list_type = typing.get_args(field_type)[0]
        return [list_type.from_serializer(v) if hasattr(v, "validated_data") else list_type(**v) for v in value]

    if hasattr(value, "validated_data"):
        return real_type.from_serializer(value)

    if isinstance(value, dict):
        return real_type(**value)

    return value


def generate_random_six_digit_string_v1():
    # Genera un número entero aleatorio entre 0 y 999999 (ambos inclusive)
    random_number = random.randint(0, 999999)

    # Formatea el número a una cadena de 6 dígitos, rellenando con ceros a la izquierda
    # '{:06d}'.format(random_number) hace el relleno con ceros
    random_string = '{:06d}'.format(random_number)

    return random_string


import random
import uuid
import os
from django.utils.text import slugify


# ... (otras importaciones como boto3, io, PIL.Image) ...

def generate_random_10_digit_number():
    """
    Genera un número entero aleatorio de 10 dígitos.
    """
    # El rango va desde 1,000,000,000 (el número más pequeño de 10 dígitos)
    # hasta 9,999,999,999 (el número más grande de 10 dígitos).
    return random.randint(1000000000, 9999999999)

