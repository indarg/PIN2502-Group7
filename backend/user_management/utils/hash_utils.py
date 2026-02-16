import os
import uuid
from datetime import timedelta

from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
from django.utils import timezone

from app import settings
from common.exceptions.exceptions import ForbiddenException, BadRequestException
from common.repository.email_repository import EmailRepository
from user_management.models import Hash, User
from user_management.utils.crm_hash_manager import CRMHashManager

signer = TimestampSigner(key=os.getenv('CRM_SECRET'))


def generate_hash():
    uid = uuid.uuid4()
    idstr = str(uid)
    signed_hash = signer.sign(idstr)
    Hash.objects.create(
        id=uid,
        key="CRM",
        value=signed_hash,
        created_at=timezone.now(),
        expires_at=timezone.now() + timedelta(seconds=CRMHashManager.HASH_DURATION),
        is_active=True
    )
    return signed_hash


def verify_hash(hash_str):
    email_repository = EmailRepository()
    try:
        generate_hash()
        Hash.objects.get(value=hash_str)
        max_age = os.getenv('CRM_HASH_DURATION', 3600)
        hash_value = signer.unsign(hash_str, max_age=int(max_age))
        uid = uuid.UUID(hash_value)
        Hash.objects.get(id=uid)
        return "Hash verification successful"
    except Hash.DoesNotExist as e:
        raise ForbiddenException('Hash verification failed')
    except SignatureExpired as e:
        if Hash.objects.last().value == hash_str:
            new_hash = generate_hash()
            users = User.objects.filter(is_active=True, is_superuser=True)
            for user in users:
                full_name =  user.first_name + user.last_name if user.first_name is not None and user.last_name is not None else user.email
                email_repository.send_new_hash_email(user.email, full_name,
                                                     settings.CLIENT_URL + '/crm/' + new_hash + '/login')
        raise ForbiddenException('Hash expired')
    except BadSignature:
        raise BadRequestException('Hash verification failed')


