from django.urls import path
from django.conf.urls import include

from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('messenger/', views.messenger, name='messenger'),
]