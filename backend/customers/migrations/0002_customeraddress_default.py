# Generated by Django 2.2.28 on 2023-02-07 14:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customeraddress',
            name='default',
            field=models.BooleanField(default=False),
        ),
    ]
