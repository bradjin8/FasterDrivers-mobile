# Generated by Django 3.0 on 2023-06-07 13:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0004_restaurant_connect_account'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='tax_rate',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=4),
        ),
    ]
