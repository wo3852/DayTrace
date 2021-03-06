import uuid

from django.db import models

# Create your models here.
class Post(models.Model):
    post_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    content = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    like_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post_uuid = models.ForeignKey('Post', on_delete=models.CASCADE)
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)

class Reply_like(models.Model):
    reply_like_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    reply_uuid = models.ForeignKey('reply', on_delete=models.CASCADE)
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)

class reply(models.Model):
    reply_uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post_uuid = models.ForeignKey('Post', on_delete=models.CASCADE)
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    created_date = models.DateTimeField(auto_now_add=True)
    reply_text = models.TextField()
