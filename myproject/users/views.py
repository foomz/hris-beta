from go_questionary import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import viewsets, status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import Employee, Attendance, Recruit, UserProgress, Screening 
from .models import BackgroundCheck, FinalInterview, PayrollAccount, Payroll
from .serializers import EmployeeSerializer, AttendanceSerializer, RecruitSerializer, FinalInterviewSerializer
from .serializers import UserProgressSerializer, ScreeningSerializer, BackgroundCheckSerializer
from .serializers import PayrollAccountSerializer, PayrollSerializer
from rest_framework.permissions import IsAuthenticated
import logging
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser

# Login view for user authentication
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "token": str(refresh.access_token),
                "user": {
                    "username": user.username,
                    "email": user.email,
                }
            })

        return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

# List and Create view for employees
class EmployeeListCreate(generics.ListCreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

# Detail view for individual employee (Retrieve, Update, Delete)
class EmployeeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]  # Ensure the permissions allow the request
    
    def delete(self, request, *args, **kwargs):
        response = super().delete(request, *args, **kwargs)
        response['Access-Control-Allow-Origin'] = '*'  # Allow CORS from any origin
        return response

# List and Create view for attendance
class AttendanceListCreate(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

# Detail view for individual attendance record (Retrieve, Update, Delete)
class AttendanceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

# List and Create view for recruits
class RecruitListCreate(generics.ListCreateAPIView):
    queryset = Recruit.objects.all()
    serializer_class = RecruitSerializer

# Detail view for individual recruit (Retrieve, Update, Delete)
class RecruitDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recruit.objects.all()
    serializer_class = RecruitSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Copy request data to a mutable dictionary
        data = request.data.copy()

        # Ensure that existing files are retained if no new files are provided
        if 'photo' not in data and instance.photo:
            data['photo'] = instance.photo

        if 'pdf_file' not in data and instance.pdf_file:
            data['pdf_file'] = instance.pdf_file

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

# Save screening data for a recruit
@api_view(['POST'])
def save_screening_data(request, pk):
    recruit = get_object_or_404(Recruit, pk=pk)
    skills = request.data.get('skills', None)
    rate = request.data.get('rate', None)
    work_experience = request.data.get('work_experience', None)
    
    if skills is not None:
        recruit.skills = skills
    if rate is not None:
        recruit.rate = rate
    if work_experience is not None:
        recruit.work_experience = work_experience
    
    try:
        recruit.save()
        return Response({'status': 'success', 'data': RecruitSerializer(recruit).data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Save and update progress data including screening, background check, and final interview
@api_view(['POST'])
def progress_view(request, pk):
    recruit = get_object_or_404(Recruit, pk=pk)
    progress_data = request.data
    
    try:
        # Update the recruit with the received data
        if 'skills' in progress_data:
            recruit.skills = progress_data['skills']
        if 'rate' in progress_data:
            recruit.rate = progress_data['rate']
        if 'work_experience' in progress_data:
            recruit.work_experience = progress_data['work_experience']
        if 'social_media_1' in progress_data:
            recruit.social_media_1 = progress_data['social_media_1']
        if 'social_media_2' in progress_data:
            recruit.social_media_2 = progress_data['social_media_2']
        if 'has_pending_cases' in progress_data:
            recruit.has_pending_cases = progress_data['has_pending_cases']
        if 'pending_case_details' in progress_data:
            recruit.pending_case_details = progress_data['pending_case_details']
        if 'father_name' in progress_data:
            recruit.father_name = progress_data['father_name']
        if 'father_address' in progress_data:
            recruit.father_address = progress_data['father_address']
        if 'father_occupation' in progress_data:
            recruit.father_occupation = progress_data['father_occupation']
        if 'mother_name' in progress_data:
            recruit.mother_name = progress_data['mother_name']
        if 'mother_address' in progress_data:
            recruit.mother_address = progress_data['mother_address']
        if 'mother_occupation' in progress_data:
            recruit.mother_occupation = progress_data['mother_occupation']
        if 'sibling_name' in progress_data:
            recruit.sibling_name = progress_data['sibling_name']
        if 'sibling_address' in progress_data:
            recruit.sibling_address = progress_data['sibling_address']
        if 'sibling_occupation' in progress_data:
            recruit.sibling_occupation = progress_data['sibling_occupation']
        if 'religion' in progress_data:
            recruit.religion = progress_data['religion']
        if 'passed_interview' in progress_data:
            recruit.passed_interview = progress_data['passed_interview']
        if 'interview_manager' in progress_data:
            recruit.interview_manager = progress_data['interview_manager']
        if 'hiring_manager' in progress_data:
            recruit.hiring_manager = progress_data['hiring_manager']
        if 'hiring_date' in progress_data:
            recruit.hiring_date = progress_data['hiring_date']
        
        recruit.save()
        return Response({'status': 'success', 'data': RecruitSerializer(recruit).data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserProgressView(APIView):
  permission_classes = [IsAuthenticated]  # Only allow authenticated users to access

  def get(self, request):
    # Get user progress data based on the logged-in user
    user = request.user
    progress_data = UserProgress.objects.filter(user=user)
    serializer = UserProgressSerializer(progress_data, many=True)
    return Response(serializer.data)

  def post(self, request):
    # Allow creating a new user progress record (optional, based on your needs)
    serializer = UserProgressSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)  # Created
    return Response(serializer.errors, status=400)  # Bad request


logger = logging.getLogger(__name__)
class ScreeningListCreate(generics.ListCreateAPIView):
    queryset = Screening.objects.all()
    serializer_class = ScreeningSerializer

    def get_queryset(self):
        recruit_id = self.request.query_params.get('recruit_id')
        if recruit_id:
            return self.queryset.filter(recruit_id=recruit_id)
        return self.queryset
    
    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        logger.debug(f"Incoming data: {request.data}")
        return super().create(request, *args, **kwargs)

class ScreeningRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Screening.objects.all()
    serializer_class = ScreeningSerializer

class BackgroundCheckListCreate(generics.ListCreateAPIView):
    queryset = BackgroundCheck.objects.all()
    serializer_class = BackgroundCheckSerializer

    def get_queryset(self):
        recruit_id = self.request.query_params.get('recruit_id')
        if recruit_id:
            return self.queryset.filter(recruit_id=recruit_id)
        return self.queryset

class BackgroundCheckRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = BackgroundCheck.objects.all()
    serializer_class = BackgroundCheckSerializer

class FinalInterviewListCreate(generics.ListCreateAPIView):
    queryset = FinalInterview.objects.all()
    serializer_class = FinalInterviewSerializer

    def get_queryset(self):
        recruit_id = self.request.query_params.get('recruit_id')
        if recruit_id:
            return self.queryset.filter(recruit__id=recruit_id)
        return self.queryset

class FinalInterviewRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = FinalInterview.objects.all()
    serializer_class = FinalInterviewSerializer

class PayrollAccountListCreateView(generics.ListCreateAPIView):
    queryset = PayrollAccount.objects.all()
    serializer_class = PayrollAccountSerializer

class PayrollAccountRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PayrollAccount.objects.all()
    serializer_class = PayrollAccountSerializer

class PayrollListCreateView(generics.ListCreateAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

class PayrollRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer