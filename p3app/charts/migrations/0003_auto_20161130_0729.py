# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-30 07:29
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('charts', '0002_auto_20161129_1146'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='figure',
            name='dataset',
        ),
        migrations.AddField(
            model_name='figure',
            name='chart',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='charts.Chart'),
        ),
    ]