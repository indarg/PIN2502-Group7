"""Contains the tag repository"""

from common.helpers.query_options import QueryOptions
from common.serializer.CamelCaseMixin import to_camelcase_data
from motor_insight.contract.to.tag_to import TagTO
from motor_insight.models.tag import Tag
from motor_insight.repository.tag_repository import TagRepository


class TagRepositoryImpl(TagRepository):
    """Contains the database access for tag model"""

    def soft_delete_by_id(self, id):
        pass

    def restore_by_id(self, id):
        pass

    def create_or_update(self, data, update=False):
        """
        Add new tag to the database.
        """
        tag = Tag.from_to(data, True, update)
        return TagTO.from_model(tag)

    def get_tags_by_filters(self, **kwargs) -> list[TagTO]:
        filters = {key: value for key, value in kwargs.items() if value is not None}
        tag_found = Tag.objects.filter(**filters).first()
        return TagTO.from_model(tag_found)

    def get_all(self, **kwargs) -> list[TagTO]:
        filters = {key: value for key, value in kwargs.items() if value is not None}
        tag_query = Tag.objects.filter(**filters)
        return [] if not tag_query or len(tag_query) == 0 else TagTO.from_models(tag_query)

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs) -> dict:
        tag_query = Tag.objects.all()

        # Ensure query_options exists
        if not query_options:
            query_options = QueryOptions(
                page_number=0,
                page_size=10,
                order_by={"created_at": "asc"}  # Default ordering by id
            )

        query_options.add_order_by({"created_at": "asc"})

        # Handle query_options if provided, otherwise return all records without pagination
        if query_options:
            # Get searchable fields, including related fields if needed
            #  query_options.search_fields = query_options.get_queryable_fields(
            #      model=Tag, include_relations=True
            #  )

            # Apply filters, ordering, and pagination
            paginated_tags = query_options.filter_and_exec_queryset(tag_query, model=Tag)

        return {
            'results': [],
            'total': 0,
        } if not paginated_tags['results'] or len(paginated_tags['results']) == 0 else {
            'results': [to_camelcase_data(tagTO.to_dict()) for tagTO in
                        TagTO.from_models(paginated_tags['results'])],
            'total': paginated_tags['total'],
        }

    def get_by_id(self, id):
        try:
            return TagTO.from_model(Tag.objects.get(id=id))
        except Tag.DoesNotExist:
            return None

    def delete_by_id(self, obj_id):
        try:
            tag = Tag.objects.get(id=obj_id)
            tag.delete()
            return True
        except Tag.DoesNotExist:
            return False

    def get_deleted_by_id(self, id):
        pass