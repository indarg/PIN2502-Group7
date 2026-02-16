# sitemaps.py
from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from motor_insight.models import News


class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = 'monthly'

    def items(self):
        return [
            "/inicio",
            "/noticias",
            "/lanzamientos",
            "/adelantos",
            "/nosotros",
            "/privacidad",
            "/terminos",
        ]

    def location(self, item):
        return item

class NewsSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.8

    def items(self):
        return News.objects.filter(published=True,is_deleted=False).all()

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"/noticias/{obj.id}"

class ReleasesSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.8



    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"/lanzamientos/{obj.id}"

class TeasersSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.7


    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"/adelantos/{obj.id}"
