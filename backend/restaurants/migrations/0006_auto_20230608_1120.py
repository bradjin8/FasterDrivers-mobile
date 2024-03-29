# Generated by Django 3.0 on 2023-06-08 11:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('djstripe', '0008_2_5'),
        ('restaurants', '0005_restaurant_tax_rate'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='account',
            field=models.ForeignKey(blank=True, help_text="The Restaurant's Stripe Customer object, if it exists", null=True, on_delete=django.db.models.deletion.CASCADE, to='djstripe.Customer'),
        ),
        migrations.AddField(
            model_name='restaurant',
            name='subscription',
            field=models.ForeignKey(blank=True, help_text="The Restuarants's Stripe Subscription object, if it exists", null=True, on_delete=django.db.models.deletion.SET_NULL, to='djstripe.Subscription'),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='connect_account',
            field=models.ForeignKey(blank=True, help_text="The Restaurant's Stripe Connect Account object, if it exists", null=True, on_delete=django.db.models.deletion.SET_NULL, to='djstripe.Account'),
        ),
    ]
