from django.urls import path
from .views import *

urlpatterns = [
    path('ajax_send_reply/', ajax_send_reply, name='ajax_send_reply'),
    path('ajax_get_post/', ajax_get_post, name='ajax_get_post'),
    path('ajax_send_post/', ajax_send_post, name='ajax_send_post'),
    path('ajax_get_post_newsfeed/', ajax_get_post_newsfeed, name='ajax_get_post_newsfeed'),
]