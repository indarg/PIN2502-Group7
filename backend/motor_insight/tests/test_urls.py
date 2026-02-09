from django.test import SimpleTestCase
from django.urls import reverse, resolve

from motor_insight.interfaces.public.get_news_controller import get_news_crm_controller
from motor_insight.interfaces.public.get_releases_controller import get_releases_crm_controller


class TestUrls(SimpleTestCase):
    """Contains the tests of each url's controller"""

    def test_get_news_crm_controller_resolves(self):
        """Test that create analysis url works"""
        url = reverse("get_news_crm_controller")
        print(url)
        self.assertEqual(resolve(url).func, get_news_crm_controller)


    def test_get_releases_crm_controller_resolves(self):
        """Test that create analysis url works"""
        url = reverse("get_releases_crm_controller")
        print(url)
        self.assertEqual(resolve(url).func, get_releases_crm_controller)

