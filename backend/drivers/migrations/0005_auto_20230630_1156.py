# Generated by Django 3.0 on 2023-06-30 11:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('drivers', '0004_auto_20230608_1120'),
    ]

    operations = [
        migrations.RenameField(
            model_name='driver',
            old_name='account',
            new_name='stripe_account',
        ),
    ]