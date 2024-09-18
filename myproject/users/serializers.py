#serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Employee, Attendance, Recruit, UserProgress
from .models import Screening, BackgroundCheck, FinalInterview, PayrollAccount, Payroll


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['employee_id', 'full_name', 'position', 'department', 'type', 'status', 'location','contacts', 'profile_picture']

class AttendanceSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    full_name = serializers.CharField(source='employee.full_name', read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'

    def validate(self, data):
        # You can add custom validation logic here
        if not data.get('employee'):
            raise serializers.ValidationError("Employee is required.")
        if not data.get('time_in'):
            raise serializers.ValidationError("Time In is required.")
        if not data.get('time_out'):
            raise serializers.ValidationError("Time Out is required.")
        return data

class RecruitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruit
        fields = '__all__'  # or specify the fields explicitly

    # Example of handling file upload fields
    pdf_file = serializers.FileField(allow_empty_file=True, required=False)
    photo = serializers.ImageField(allow_empty_file=True, required=False)

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id', 'user', 'recruit', 'progress_stage']

class ScreeningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screening
        fields = ['id', 'recruit', 'staff_name', 'screening_date']

class BackgroundCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackgroundCheck
        fields = '__all__'

class FinalInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalInterview
        fields = ['id', 'recruit', 'passed', 'manager_name', 'interview_date']

class PayrollAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollAccount
        fields = '__all__'  # Or list the specific fields you want to include
        required = ['full_name', 'bank_name', 'bank_account', 'basic_pay', 'gross_pay',
                    'over_time_pay', 'sss_account', 'sss_contribution', 'gsis_account',
                    'gsis_contribution', 'phil_health_account', 'phil_health_contribution',
                    'pag_ibig_account', 'pag_ibig_contribution']

class PayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payroll
        fields = [ 'id', 'full_name', 'position', 'department', 'start_date', 'end_date', 'worked_days',
                  'basic_pay', 'over_time_pay', 'allowance', 'sss_contribution', 'gsis_contribution',
                  'phil_health_contribution', 'pag_ibig_contribution', 'gross_pay', 'total_deductions',
                   'net_pay'] #remember structure of the fields jr