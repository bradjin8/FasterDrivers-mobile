# Generated by Django 3.0 on 2023-06-07 13:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('djstripe', '0008_2_5'),
        ('drivers', '0002_driver_car_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='connect_account',
            field=models.ForeignKey(blank=True, help_text="The Driver's Stripe Account object, if it exists", null=True, on_delete=django.db.models.deletion.SET_NULL, to='djstripe.Account'),
        ),
    ]
