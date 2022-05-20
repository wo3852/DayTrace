# Generated by Django 4.0.4 on 2022-05-19 00:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('post', '0003_reply'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reply_like',
            fields=[
                ('reply_like_uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('reply_uuid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='post.reply')),
            ],
        ),
    ]