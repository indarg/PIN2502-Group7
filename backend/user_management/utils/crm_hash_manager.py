import os
import uuid
from datetime import datetime, timedelta
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
from django.utils import timezone
from django.db import transaction
from django.core.cache import cache
import logging
from app import settings
from common.exceptions.exceptions import ForbiddenException, BadRequestException
from common.repository.email_repository import EmailRepository
from user_management.models import Hash, User

logger = logging.getLogger(__name__)
signer = TimestampSigner(key=os.getenv('CRM_SECRET'))


class CRMHashManager:
    """
    Manages access hashes for CRM entry.
    Hash only grants access to CRM login page, not authentication.
    """

    HASH_DURATION = int(os.getenv('CRM_HASH_DURATION', 1296000))  # 15 days
    ROTATION_THRESHOLD = 0.8  # Rotate when 80% of lifetime has passed
    EMAIL_COOLDOWN = 1800  # 30 minute cooldown between email notifications
    MAX_ATTEMPTS_PER_HOUR = 20  # Rate limiting

    @staticmethod
    def generate_hash():
        """Generate a new CRM access hash and email it to staff"""
        uid = uuid.uuid4()
        signed_hash = signer.sign(str(uid))

        with transaction.atomic():
            # Deactivate old access hashes
            Hash.objects.filter(key="CRM", is_active=True).update(is_active=False)

            # Create new access hash
            # Clean up very old hashes
            cutoff_date = timezone.now() - timedelta(days=90)
            Hash.objects.filter(
                key="CRM",
                created_at__lt=cutoff_date,
                is_active=False
            ).delete()

            hash_obj = Hash.objects.create(
                id=uid,
                key="CRM",
                value=signed_hash,
                created_at=timezone.now(),
                expires_at=timezone.now() + timedelta(seconds=CRMHashManager.HASH_DURATION),
                is_active=True
            )


        # Email the new hash to staff
        CRMHashManager._email_hash_to_staff(signed_hash, is_new=True)

        logger.info(f"New CRM access hash generated and emailed to staff: {uid}")
        return signed_hash

    @staticmethod
    def verify_hash(hash_str, request=None):
        """Verify CRM access hash"""

        if not hash_str or not hash_str.strip():
            raise ForbiddenException('Enlace de acceso requerido')

        # Rate limiting check
        client_ip = CRMHashManager._get_client_ip(request)
        if CRMHashManager._is_rate_limited(client_ip):
            logger.warning(f"Rate limited CRM access attempt from {client_ip}")
            raise ForbiddenException('Demasiados intentos. Intente más tarde.')

        try:
            # Verify signature and extract UUID
            hash_value = signer.unsign(hash_str, max_age=CRMHashManager.HASH_DURATION)
            uid = uuid.UUID(hash_value)

            # Check if access hash exists and is active
            hash_obj = Hash.objects.get(
                id=uid,
                key="CRM",
                value=hash_str,
                is_active=True
            )

            # Check if we need proactive rotation
            time_until_expiry = hash_obj.expires_at - timezone.now()
            rotation_threshold_time = timedelta(
                seconds=CRMHashManager.HASH_DURATION * (1 - CRMHashManager.ROTATION_THRESHOLD)
            )

            if time_until_expiry <= rotation_threshold_time:
                CRMHashManager._initiate_proactive_rotation(hash_obj)
                raise ForbiddenException('El enlace ha expirado. Se enviará uno nuevo por correo.')

            logger.info(f"CRM access granted via hash: {uid} from IP: {client_ip}")
            return "Hash verification successful"

        except Hash.DoesNotExist:
            CRMHashManager._record_failed_attempt(client_ip, "hash_not_found")
            raise ForbiddenException('Enlace de acceso inválido')
        except SignatureExpired:
            CRMHashManager._handle_expired_hash(hash_str)
            CRMHashManager._record_failed_attempt(client_ip, "signature_expired")
            raise ForbiddenException('El enlace ha expirado. Se enviará uno nuevo por correo.')
        except (BadSignature, ValueError):
            CRMHashManager._record_failed_attempt(client_ip, "bad_signature")
            raise ForbiddenException('Enlace de acceso inválido')

    @staticmethod
    def _get_client_ip(request):
        """Extract client IP from request"""
        if not request:
            return "unknown"

        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', 'unknown')
        return ip

    @staticmethod
    def _is_rate_limited(client_ip):
        """Check if client IP is rate limited"""
        cache_key = f"crm_hash_attempts_{client_ip}"
        attempts = cache.get(cache_key, 0)
        return attempts >= CRMHashManager.MAX_ATTEMPTS_PER_HOUR

    @staticmethod
    def _record_failed_attempt(client_ip, reason):
        """Record failed access verification attempt"""
        cache_key = f"crm_hash_attempts_{client_ip}"
        attempts = cache.get(cache_key, 0) + 1
        cache.set(cache_key, attempts, 3600)  # 1 hour

        logger.warning(f"Failed CRM access attempt from {client_ip}: {reason} (attempt {attempts})")

    @staticmethod
    def _initiate_proactive_rotation(current_hash_obj):
        """Proactively rotate access hash before expiration"""
        cache_key = f"crm_hash_rotation_{current_hash_obj.id}"

        # Prevent multiple simultaneous rotations
        if cache.get(cache_key):
            return

        cache.set(cache_key, True, 300)  # 5-minute lock

        try:
            new_hash = CRMHashManager.generate_hash()
            logger.info(f"Proactive hash rotation completed. Old: {current_hash_obj.id}")
        except Exception as e:
            logger.error(f"Proactive hash rotation failed: {e}")
        finally:
            cache.delete(cache_key)

    @staticmethod
    def _handle_expired_hash(expired_hash_str):
        """Handle expired access hash by generating new one if needed"""
        cache_key = "crm_expired_hash_handling"

        # Prevent spam from multiple expired hash attempts
        if cache.get(cache_key):
            return

        cache.set(cache_key, True, CRMHashManager.EMAIL_COOLDOWN)

        try:
            # Check if there's any active access hash
            active_hash_exists = Hash.objects.filter(
                key="CRM",
                is_active=True,
                expires_at__gt=timezone.now()
            ).exists()

            if not active_hash_exists:
                logger.warning("No active CRM hash found, generating new one")
                new_hash = CRMHashManager.generate_hash()
            else:
                # Send reminder email with current active hash
                current_hash = Hash.objects.filter(
                    key="CRM",
                    is_active=True,
                    expires_at__gt=timezone.now()
                ).first()
                if current_hash:
                    logger.info("Sending reminder email with current active hash")
                    CRMHashManager._email_hash_to_staff(current_hash.value, is_reminder=True)

        except Exception as e:
            logger.error(f"Expired hash handling failed: {e}")
            # Try to generate emergency hash
            try:
                emergency_hash = CRMHashManager.generate_hash()
                logger.info("Emergency hash generated due to handling failure")
            except Exception as emergency_error:
                logger.critical(f"Failed to generate emergency hash: {emergency_error}")

    @staticmethod
    def _email_hash_to_staff(hash_value, is_new=False, is_reminder=False):
        """Send hash to all active staff users"""
        try:
            email_repository = EmailRepository()
            staff_users = User.objects.filter(
                is_active=True,
                is_staff=True,
                email__isnull=False
            ).exclude(email='')

            if not staff_users.exists():
                logger.error("No staff users found to send CRM hash")
                return

            crm_url = f"{settings.CLIENT_URL}/crm/{hash_value}/login"
            success_count = 0

            for user in staff_users:
                try:
                    full_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
                    if not full_name:
                        full_name = user.email.split('@')[0]

                    # Always send the email (same template for both new and reminder)
                    email_repository.send_new_hash_email(user.email, full_name, crm_url)
                    success_count += 1

                except Exception as e:
                    logger.error(f"Failed to send CRM hash email to {user.email}: {e}")

            email_type = "reminder" if is_reminder else "new"
            logger.info(f"CRM {email_type} hash sent to {success_count}/{staff_users.count()} staff members")

        except Exception as e:
            logger.error(f"Failed to email CRM hash to staff: {e}")