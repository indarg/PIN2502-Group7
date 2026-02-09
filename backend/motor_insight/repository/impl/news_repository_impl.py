"""Contains the news repository"""
from common.exceptions.exceptions import NotFoundException
from common.helpers.query_options import QueryOptions
from common.serializer.CamelCaseMixin import to_camelcase_data
from motor_insight.contract.to.news_to import NewsTO
from motor_insight.models.news import News
from motor_insight.repository.news_repository import NewsRepository
from django.db.models import Q


class NewsRepositoryImpl(NewsRepository):
    """Contains the database access for news model"""

    def restore_by_id(self, id):
        try:
            News.objects.get_deleted_only().get(id=id).restore()
            return True
        except News.DoesNotExist:
            raise NotFoundException("No se encuentra la noticia")
        except Exception as e:
            return False

    def soft_delete_by_id(self, id):
        try:
            return News.objects.get(id=id).delete()
        except News.DoesNotExist:
            raise NotFoundException("No se encuentra la noticia")

    def get_news_by_filters(self, **kwargs) -> list[NewsTO]:
        filters = {key: value for key, value in kwargs.items() if value is not None}
        news_found = News.objects.filter(**filters).first()
        return NewsTO.from_model(news_found)

    def get_all(self, **kwargs) -> list[NewsTO]:
        filters = {key: value for key, value in kwargs.items() if value is not None}
        news_query = News.objects.filter(**filters)
        return [] if not news_query or len(news_query) == 0 else NewsTO.from_models(news_query)

    def get_all_by_query_options(self, query_options: QueryOptions, **kwargs) -> dict:
        if query_options and 'is_deleted' in query_options.filters and query_options.filters['is_deleted']:
            news_query = News.objects.get_deleted_only()
        else:
            news_query = News.objects.all()

        # Ensure query_options exists
        if not query_options:
            query_options = QueryOptions(
                page_number=0,
                page_size=10,
                order_by={"created_at": "desc"}
            )

        # Handle query_options if provided, otherwise return all records without pagination
        if query_options:
            # Get searchable fields, including related fields if needed
            #  query_options.search_fields = query_options.get_queryable_fields(
            #      model=News, include_relations=True
            #  )

            # Apply filters, ordering, and pagination
            paginated_news = query_options.filter_and_exec_queryset(news_query, model=News)

        return {
            'results': [],
            'total': 0,
        } if not paginated_news['results'] or len(paginated_news['results']) == 0 else {
            'results': [to_camelcase_data(newsTO.to_dict()) for newsTO in
                        NewsTO.from_models(paginated_news['results'])],
            'total': paginated_news['total'],
        }

    def get_deleted_by_id(self, id):
        return NewsTO.from_model(News.objects.all_with_deleted().get(id=id))

    def get_by_id(self, id):
        return NewsTO.from_model(News.objects.get(id=id))

    def delete_by_id(self, obj_id):
        try:
            news = News.objects.all_with_deleted().get(id=obj_id)
            [column.image.delete() for column in news.columns.all()]
            news.columns.all().delete()
            news.images.all().delete()
            news.main_image.delete()
            news.hard_delete()
            return True
        except News.DoesNotExist:
            return False

    def create_or_update(self, data, update=False) -> NewsTO | None:
        """
        Add new news to the database.
        """
        news = News.from_to(data, True, update)
        return NewsTO.from_model(news)

    def get_filtered_and_ordered(self, search_value=None):
        queryset = News.objects.filter(published=True, is_deleted=False)

        if search_value:

            search_q = (
                    Q(headline__icontains=search_value) |
                    Q(tags__code__icontains=search_value) |
                    Q(tags__name__icontains=search_value)
            )
            queryset = queryset.filter(search_q).distinct()

        result = queryset.order_by('-created_at')
        return [NewsTO.from_model(news) for news in result.all()]
