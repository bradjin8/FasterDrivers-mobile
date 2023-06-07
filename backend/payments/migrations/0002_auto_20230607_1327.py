# Generated by Django 3.0 on 2023-06-07 13:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('djstripe', '0008_2_5'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='payment',
            name='payment_intent',
        ),
        migrations.AddField(
            model_name='payment',
            name='customer_charge',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='djstripe.Charge'),
        ),
        migrations.AddField(
            model_name='payment',
            name='driver_transfer',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='driver_transfers', to='djstripe.Transfer'),
        ),
        migrations.AddField(
            model_name='payment',
            name='restaurant_transfer',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='restaurant_transfers', to='djstripe.Transfer'),
        ),
        migrations.CreateModel(
            name='SubscriptionSetup',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('subscription', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='djstripe.Subscription')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
