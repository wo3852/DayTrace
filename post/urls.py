from django.urls import path
from .views import *

urlpatterns = [
    path('ajax_send_reply/', ajax_send_reply, name='ajax_send_reply'),
    path('ajax_get_reply/', ajax_get_reply, name='ajax_get_reply'),
    path('ajax_get_post/', ajax_get_post, name='ajax_get_post'),
    path('ajax_send_post/', ajax_send_post, name='ajax_send_post'),
    path('ajax_post_delete/', ajax_post_delete, name='ajax_post_delete'),
    path('ajax_reply_delete/', ajax_reply_delete, name='ajax_reply_delete'),
    path('ajax_post_update/', ajax_post_update, name='ajax_post_update'),
    path('ajax_reply_update/', ajax_reply_update, name='ajax_reply_update'),
    path('ajax_post_send_like/', ajax_post_send_like, name='ajax_post_send_like'),
    path('ajax_reply_send_like/', ajax_reply_send_like, name='ajax_reply_send_like'),
]