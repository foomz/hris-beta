# Generated by Django 4.2.14 on 2024-08-31 05:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_employee_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='id',
            field=models.CharField(default='', max_length=20, primary_key=True, serialize=False),
        ),
    ]
