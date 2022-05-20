from django.urls import path

from . import views

urlpatterns = [
    path('', views.start, name='start'),
    path('home/<str:param>', views.index, name='index'),
    path('messenger/', views.messenger, name='messenger'),
    path('newsfeed/', views.newsfeed, name='newsfeed'),
    path('post_reply_pop/', views.post_reply_pop, name='post_reply_pop'),
    path('ajax_user_img_upload/', views.ajax_user_img_upload, name='ajax_user_img_upload'),
]


