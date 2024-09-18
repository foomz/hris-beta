# Generated by Django 4.2.14 on 2024-08-31 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_rename_loan_cash_payrollaccount_gross_pay_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='payrollaccount',
            old_name='overtime_pay',
            new_name='allowance',
        ),
        migrations.RenameField(
            model_name='payrollaccount',
            old_name='pagibig_contribution',
            new_name='over_time_pay',
        ),
        migrations.RenameField(
            model_name='payrollaccount',
            old_name='philhealth_contribution',
            new_name='pag_ibig_contribution',
        ),
        migrations.RemoveField(
            model_name='payrollaccount',
            name='employee',
        ),
        migrations.RemoveField(
            model_name='payrollaccount',
            name='pagibig_account',
        ),
        migrations.RemoveField(
            model_name='payrollaccount',
            name='philhealth_account',
        ),
        migrations.AddField(
            model_name='payrollaccount',
            name='bank_account',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='payrollaccount',
            name='bank_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='payrollaccount',
            name='department',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='payrollaccount',
            name='full_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='payrollaccount',
            name='pag_ibig_account',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='payrollaccount',
            name='phil_health_account',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='payrollaccount',
            name='phil_health_contribution',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='payrollaccount',
            name='position',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='payrollaccount',
            name='gsis_account',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='payrollaccount',
            name='sss_account',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
