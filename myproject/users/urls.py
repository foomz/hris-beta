from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from .views import (
    LoginView, EmployeeListCreate, EmployeeDetail, 
    AttendanceListCreate, AttendanceDetail, RecruitListCreate, 
    RecruitDetail, save_screening_data, progress_view, 
    UserProgressView, ScreeningListCreate, ScreeningRetrieveUpdateDestroy,
    BackgroundCheckListCreate, BackgroundCheckRetrieveUpdateDestroy, FinalInterviewListCreate,
    FinalInterviewRetrieveUpdateDestroy, PayrollAccountListCreateView, PayrollAccountRetrieveUpdateDestroyView,
    PayrollListCreateView, PayrollRetrieveUpdateDestroyView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('employees/', EmployeeListCreate.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeDetail.as_view(), name='employee-detail'),
    path('attendance/', AttendanceListCreate.as_view(), name='attendance-list-create'),
    path('attendance/<int:pk>/', AttendanceDetail.as_view(), name='attendance-detail'),
    path('recruits/', RecruitListCreate.as_view(), name='recruit-list-create'),
    path('recruits/<int:pk>/', RecruitDetail.as_view(), name='recruit-detail'),
    path('recruits/<int:pk>/progress/', progress_view, name='progress-view'),
    path('recruits/<int:pk>/screening/', save_screening_data, name='save-screening-data'),
    path('api/user-progress/', UserProgressView.as_view(), name='user-progress'),
    path('screening/', ScreeningListCreate.as_view(), name='screening-list-create'),
    path('screening/<int:pk>/', ScreeningRetrieveUpdateDestroy.as_view(), name='screening-detail'),
    path('background-check/', BackgroundCheckListCreate.as_view(), name='background-check-list-create'),
    path('background-check/<int:pk>/', BackgroundCheckRetrieveUpdateDestroy.as_view(), name='background-check-detail'),
    path('final-interview/', FinalInterviewListCreate.as_view(), name='final-interview-list-create'),
    path('final-interview/<int:pk>/', FinalInterviewRetrieveUpdateDestroy.as_view(), name='final-interview-detail'),
    path('payroll-accounts/', PayrollAccountListCreateView.as_view(), name='payrollaccount-list-create'),
    path('payroll-accounts/<int:pk>/', PayrollAccountRetrieveUpdateDestroyView.as_view(), name='payrollaccount-detail'),
    path('payroll/', PayrollListCreateView.as_view(), name='payroll-list-create'),
    path('payroll/<int:pk>/', PayrollRetrieveUpdateDestroyView.as_view(), name='payroll-detail'),
]

# Serving media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)