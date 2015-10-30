from django.conf.urls import url, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'accounts', views.AccountViewSet)

urlpatterns = [
    url(r'v1/', include(router.urls, namespace='v1')),
    url(r'^drf/auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^auth/login/$', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^auth/refresh/$', 'rest_framework_jwt.views.refresh_jwt_token'),
    url(r'^auth/verify/$', 'rest_framework_jwt.views.verify_jwt_token'),
]
