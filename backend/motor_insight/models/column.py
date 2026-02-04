"""This module contains the column model"""
from django.db import models, transaction

from common.helpers.utils import convert_field
from user_management.models.audit_model import AuditModel


class Column(AuditModel):
    """Column model for managing automotive column, launches, and tests."""
    title = models.CharField(max_length=300, blank=True)
    body = models.TextField(blank=True)
    image = models.ForeignKey('common.MediaFile', blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        """Table's metadata"""
        db_table = 'column'

    @classmethod
    def from_to(cls, column_to, check_exists: bool = False, update=False) -> 'Column':
        """
        Creates a Column instance from an ColumnTO instance without saving it.

        Args:
            column_to (ColumnTO): Transfer Object containing the Column data.

        Returns:
            Column: An instance of the Column model.
            :param update:
            :param column_to:
            :param check_exists:
        """
        from motor_insight.contract.to.column_to import ColumnTO
        from common.models.media_file import MediaFile
        if not isinstance(column_to, ColumnTO):
            column_to = convert_field(column_to, ColumnTO)

        update_or_create_defaults = {
            'title': column_to.title,
            'body': column_to.body,
            'image': MediaFile.from_to(column_to.image),
        }

        with transaction.atomic():
            if update and column_to.id is not None and column_to.id > 0 and Column.objects.filter(id=column_to.id).exists():
                column_instance = Column.objects.filter(id=column_to.id).update(
                    **update_or_create_defaults
                )
                column_instance = Column.objects.get(id=column_to.id)
            else:
                column_instance = Column.objects.create(
                    **update_or_create_defaults
                )

        return column_instance

    @classmethod
    def from_tos(cls, TOs):
        """
        Transform a list of TOs into a list of model instances.
        """
        if not TOs:
            return None
        return [cls.from_to(TO) for TO in TOs]
