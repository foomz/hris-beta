# Generated by Django 4.2.14 on 2024-08-31 05:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_alter_employee_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payrollaccount',
            name='employee',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='users.employee'),
        ),
    ]
