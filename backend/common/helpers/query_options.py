"""This module contains the query options"""
import ast
import json
from math import ceil
from typing import List, Optional, Type

from django.db.models import Q, QuerySet, Model
from pandas import DataFrame
from rest_framework import serializers

from common.serializer.CamelCaseMixin import to_snake_case_data


class QueryOptions(serializers.Serializer):
    """Class for handling the querying, ordering and pagination"""

    def __init__(self,
                 page_number=None,
                 page_size=None,
                 search_term=None,
                 search_class=None,
                 search_fields=None,
                 order_by=None,
                 filters=None):
        super().__init__()
        self.page_number = page_number
        self.page_size = page_size
        self.search_term = search_term
        self.search_class = search_class
        self.search_fields = search_fields
        self.order_by = order_by
        self.filters = filters or {}

    def to_dict(self):
        """Return a dict of the query options"""
        return {
            'page_number': self.page_number,
            'page_size': self.page_size,
            'search_term': self.search_term,
            'search_fields': self.search_fields,
            'order_by': self.order_by
        }

    @classmethod
    def from_dict(cls, data):
        """Creates a QueryOption from a dict"""
        return cls(
            page_number=data.get('page_number'),
            page_size=data.get('page_size'),
            search_term=data.get('search_term'),
            search_fields=data.get('search_fields'),
            order_by=data.get('order_by')
        )

    @classmethod
    def from_request(cls, request):
        """Creates a query option from a request"""
        order_by = request.query_params.get('order_by')
        if order_by:
            order_by = ast.literal_eval(order_by)

        filters = request.query_params.get('filters')
        if filters:
            try:
                filters = to_snake_case_data(json.loads(filters))
            except json.JSONDecodeError:
                # Maneja el caso en que el string 'filters' no es JSON válido
                filters = None
                print(f"Advertencia: filters no es un JSON válido: {request.query_params.get('filters')}")
            except Exception as e:
                # Captura cualquier otra excepción inesperada
                filters = None
                print(f"Error inesperado al procesar filters: {e}")

        search_fields = request.query_params.get('search_fields')
        page_size = request.query_params.get('page_size')
        return cls(
            page_number=request.query_params.get('page_number'),
            page_size=page_size if page_size is not None and int(page_size) <= 1000 else '10' ,
            search_term=request.query_params.get('search_term'),
            search_fields=search_fields.split(',') if search_fields else search_fields,
            order_by=order_by,
            filters=filters  # Nuevo
        )

    def get_queryable_fields(self, model: Type[Model], include_relations=False) -> List[str]:
        """
        Get fields of the model that can be queried.
        Includes related fields if specified.
        """
        fields = []
        for field in model._meta.get_fields(include_parents=True):
            if include_relations and field.is_relation:
                # Recursively fetch related model fields for nested queries
                related_model = field.related_model
                if related_model:
                    related_fields = [
                        f"{field.name}__{related_field.name}"  # Example: user__name
                        for related_field in related_model._meta.get_fields()
                        if not (related_field.is_relation or related_field.many_to_many)
                    ]
                    fields.extend(related_fields)
            elif not field.is_relation:  # Include only non-relational fields
                fields.append(field.name)
        return fields

    def filter_and_exec_queryset(
            self,
            queryset: QuerySet,
            model: Type[Model],
            exclude_fields: Optional[List[str]] = None) -> dict:
        """Filter, order and paginate the response directly in SQL query, including total records."""
        if not queryset.exists():
            return {"total": 0, "results": []}

        self.search_fields = self.search_fields or [
            field.name for field in model._meta.get_fields()
            if not (field.is_relation or field.many_to_one or field.many_to_many)
        ]

        if exclude_fields:
            self.search_fields = [
                field for field in self.search_fields if field not in exclude_fields
            ]

        if self.search_term and self.search_fields:
            search_filter = Q()
            for field in self.search_fields:
                search_filter |= Q(**{f'{field}__icontains': self.search_term})
            queryset = queryset.filter(search_filter)


        if self.filters:
            tag_filters = {}
            other_filters = {}

            for key, value in self.filters.items():
                if key == 'tags__code__in':
                    tag_filters = {key: value}
                elif key != 'is_deleted':
                    other_filters[key] = value

            if tag_filters:
                queryset = queryset.filter(**tag_filters).distinct()

            if other_filters:
                queryset = queryset.filter(**other_filters)

        if self.order_by:
            ordering = []
            for field, direction in self.order_by.items():
                if direction not in ['asc', 'desc']:
                    continue
                ordering.append(field if direction == 'asc' else f'-{field}')
            if ordering:
                queryset = queryset.order_by(*ordering)

        total_count = queryset.count()

        page = int(self.page_number or 0)
        page_size = int(self.page_size or 10)
        offset = page * page_size
        paginated_queryset = queryset[offset:offset + page_size]

        return {
            "total": total_count,
            "results": list(paginated_queryset)
        }

    def add_order_by(self, order_by):
        if self.order_by:
            self.order_by = {**order_by, **self.order_by}
        else:
            self.order_by = order_by

    def paginate_and_filter_dataframe(self, dataframe: DataFrame):
        """Return the specified rows of a dataframe"""
        page_number = max(int(self.page_number), 1)
        page_size = max(int(self.page_size), 1)

        if self.search_term:
            dataframe = dataframe[
                dataframe.apply(
                    lambda row: row.astype(str).str.contains(
                        self.search_term, case=False
                    ).any(), axis=1
                )
            ]

        if self.order_by:
            for column, direction in self.order_by.items():
                dataframe = dataframe.sort_values(
                    by=column, ascending=(direction.lower() == 'asc')
                )

        total_records = len(dataframe)
        total_pages = ceil(total_records / page_size)
        total_columns = len(dataframe.columns)

        start_idx = (page_number - 1) * page_size
        end_idx = start_idx + page_size
        paginated_data = dataframe.iloc[start_idx:end_idx]

        return {
            "data": paginated_data,
            "totalRows": total_records,
            "totalColumns": total_columns,
            "totalPages": total_pages,
            "currentPage": page_number,
            "pageSize": page_size,
        }
