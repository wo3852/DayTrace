from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('messenger/', views.messenger, name='messenger'),
    path('newsfeed/', views.newsfeed, name='newsfeed'),
]


