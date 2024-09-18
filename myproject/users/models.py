from django.db import models
from django.contrib.auth.models import User

class Employee(models.Model):
    employee_id = models.AutoField(primary_key=True) #set to charfield to disable auto-gen id
    full_name = models.CharField(max_length=100)
    position = models.CharField(max_length=50)
    department = models.CharField(max_length=50)
    type = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    location = models.CharField(max_length=50)
    contacts = models.CharField(max_length=50)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return self.full_name

class Attendance(models.Model):
    date = models.DateField()
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_records')
    time_in = models.TimeField()
    time_out = models.TimeField()
    working_hours = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Attendance for {self.employee.full_name} on {self.date}"
    
class Recruit(models.Model):
    photo = models.ImageField(upload_to='recruit_photos/', blank=True, null=True)
    pdf_file = models.FileField(upload_to='recruit_pdfs/', blank=True, null=True)  # New field
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100)
    birthday = models.DateField()
    address = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    position_applied = models.CharField(max_length=100)

        # New fields related to the hiring process
    interview_manager = models.CharField(max_length=255, blank=True, null=True)
    hiring_manager = models.CharField(max_length=255, blank=True, null=True)
    hiring_date = models.DateField(blank=True, null=True)

    # New field to track onboarding progress stage
    progress_stage = models.IntegerField(default=0)  # Add this field

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recruit = models.ForeignKey(Recruit, on_delete=models.CASCADE)
    progress_stage = models.IntegerField(default=0)

class Screening(models.Model):
    recruit = models.ForeignKey('Recruit', on_delete=models.CASCADE, blank=True, null=True)
    staff_name = models.CharField(max_length=100)
    screening_date = models.DateField()

    def __str__(self):
        return f"Screening by {self.staff_name} on {self.screening_date}"

class BackgroundCheck(models.Model):
    recruit = models.ForeignKey('Recruit', on_delete=models.CASCADE, blank=True, null=True)
    social_media_accounts = models.TextField(max_length=100, blank=True, null=True)
    additional_social_media_accounts = models.CharField(max_length=100, blank=True, null=True)
    current_address = models.CharField(max_length=255, blank=True, null=True)
    previous_addresses = models.TextField(blank=True, null=True)
    mother_name = models.CharField(max_length=100, blank=True, null=True)
    mother_address = models.CharField(max_length=255, blank=True, null=True)
    mother_occupation = models.CharField(max_length=100, blank=True, null=True)
    father_name = models.CharField(max_length=100, blank=True, null=True)
    father_address = models.CharField(max_length=255, blank=True, null=True)
    father_occupation = models.CharField(max_length=100, blank=True, null=True)
    previous_employers = models.TextField(blank=True, null=True)
    job_titles_responsibilities = models.TextField(blank=True, null=True)
    dates_of_employment = models.CharField(max_length=255, blank=True, null=True)
    reasons_for_leaving = models.TextField(blank=True, null=True)
    supervisor_information = models.TextField(blank=True, null=True)
    has_criminal_record = models.BooleanField(default=False)
    criminal_record_details = models.TextField(blank=True, null=True)


class FinalInterview(models.Model):
    recruit = models.ForeignKey(Recruit, on_delete=models.CASCADE, related_name='final_interviews', blank=True, null=True)
    passed = models.BooleanField(default=False)
    manager_name = models.CharField(max_length=255)
    interview_date = models.DateField()

    def __str__(self):
        return f"Final Interview for {self.recruit.first_name} {self.recruit.last_name} by {self.manager_name}"
    
class PayrollAccount(models.Model):
    full_name = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    bank_name = models.CharField(max_length=100, blank=True, null=True)
    bank_account = models.CharField(max_length=20, blank=True, null=True)
    basic_pay = models.CharField(max_length=15, blank=True, null=True)
    gross_pay = models.CharField(max_length=15, blank=True, null=True)
    over_time_pay = models.CharField(max_length=15, blank=True, null=True)
    allowance = models.CharField(max_length=15)
    sss_account = models.CharField(max_length=15, blank=True, null=True)
    sss_contribution = models.CharField(max_length=15, blank=True, null=True)
    gsis_account = models.CharField(max_length=15, blank=True, null=True)
    gsis_contribution = models.CharField(max_length=15, blank=True, null=True)
    phil_health_account = models.CharField(max_length=15, blank=True, null=True)
    phil_health_contribution = models.CharField(max_length=15, blank=True, null=True)
    pag_ibig_account = models.CharField(max_length=15, blank=True, null=True)
    pag_ibig_contribution = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.full_name
    
from django.db import models

class Payroll(models.Model):
    full_name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    worked_days = models.PositiveIntegerField()
    basic_pay = models.DecimalField(max_digits=10, decimal_places=2)
    over_time_pay = models.DecimalField(max_digits=10, decimal_places=2)
    allowance = models.DecimalField(max_digits=10, decimal_places=2)
    sss_contribution = models.DecimalField(max_digits=10, decimal_places=2)
    gsis_contribution = models.DecimalField(max_digits=10, decimal_places=2)
    phil_health_contribution = models.DecimalField(max_digits=10, decimal_places=2)
    pag_ibig_contribution = models.DecimalField(max_digits=10, decimal_places=2)
    gross_pay = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f'{self.full_name} - {self.department}'