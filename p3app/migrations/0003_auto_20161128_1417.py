# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-28 14:17
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('p3app', '0002_dashboard'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dashboard',
            name='dataset',
        ),
        migrations.DeleteModel(
            name='DashBoard',
        ),
    ]
