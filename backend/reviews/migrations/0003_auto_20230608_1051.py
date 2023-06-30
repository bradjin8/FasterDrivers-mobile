# Generated by Django 3.0 on 2023-06-08 10:51

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0002_driverreview'),
    ]

    operations = [
        migrations.AlterField(
            model_name='driverreview',
            name='rating',
            field=models.DecimalField(decimal_places=1, max_digits=2, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)]),
        ),
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.DecimalField(decimal_places=1, max_digits=2, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)]),
        ),
    ]