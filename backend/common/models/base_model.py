from abc import abstractmethod
from django.db import models, transaction
from django.utils import timezone


class BaseModel:

    @classmethod
    def from_tos(cls, TOs):
        """
        Transform a list of TOs into a list of model instances.
        """
        if not TOs:
            return None
        return [cls.from_to(TO) for TO in TOs]

    @abstractmethod
    def from_to(cls, issue_to, check_exists: bool = False, update: bool = False):
        """Transform a TO instance into a model instance."""


from django.db.models.query import QuerySet


class SoftDeleteQuerySet(QuerySet):
    def active(self):
        return self.filter(is_deleted=False)

    def deleted(self):
        return self.filter(is_deleted=True)

    def hard_delete(self):
        return super().delete()


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).active()

    def all_with_deleted(self):
        return SoftDeleteQuerySet(self.model, using=self._db)

    def get_deleted_only(self):
        return SoftDeleteQuerySet(self.model, using=self._db).deleted()


class SoftDeleteMixin(models.Model):
    is_deleted = models.BooleanField(default=False,
                                     help_text="Indica si el objeto ha sido eliminado lógicamente (enviado a la papelera).")
    deleted_at = models.DateTimeField(null=True, blank=True,
                                      help_text="Fecha y hora en que el objeto fue enviado a la papelera.")

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        with transaction.atomic():
            self.is_deleted = True
            self.deleted_at = timezone.now()
            self.save(update_fields=['is_deleted', 'deleted_at'])
            print(f"Objeto {self} (ID: {self.pk}) enviado a la papelera.")
        return {
            'is_deleted': self.is_deleted,
            'deleted_at': self.deleted_at,
        }

    def hard_delete(self, using=None, keep_parents=False):
        with transaction.atomic():
            super().delete(using=using, keep_parents=keep_parents)
            print(f"Objeto {self} (ID: {self.pk}) eliminado permanentemente.")

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at'])
        print(f"Objeto {self} (ID: {self.pk}) restaurado de la papelera.")
