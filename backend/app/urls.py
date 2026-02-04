"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.crm_urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.crm_urls'))
"""
from django.contrib.sitemaps.views import sitemap
from rest_framework.decorators import api_view
from django.shortcuts import redirect
from django.urls import path, include
from django.conf.urls.static import static

from app import settings
from app.sitemap_controller import StaticViewSitemap, NewsSitemap, ReleasesSitemap, TeasersSitemap
from user_management.interfaces.check_hash_controller import check_hash_controller
from user_management.interfaces.csrf_token_controller import csrf_token_controller


@api_view(["GET"])
def redirect_to_health(request):
    return redirect('/api/health')


sitemaps = {
    'static': StaticViewSitemap,
    'news': NewsSitemap,
    'releases': ReleasesSitemap,
    'teasers': TeasersSitemap,
}

urlpatterns = [
                  path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django-sitemap'),

                  path('mw-server/v1/storage/crm/', include('common.urls')),

                  path('mw-server/v1/user-management/', include('user_management.urls')),

                  path('mw-server/v1/motor-insight/', include('motor_insight.urls')),

                  path('mw-server/v1/csrf', csrf_token_controller, name='csrf'),

                  path('mw-server/v1/hash/<str:hash>', check_hash_controller, name='check_hash_controller'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
