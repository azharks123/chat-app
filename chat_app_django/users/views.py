from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import permission_classes
from .serializer import UserSerializer, CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

User = get_user_model()
@permission_classes([AllowAny])
class RegisterView(APIView):
    # permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email", "")
        role = request.data.get("role", "user")

        if not username or not password:
            return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, email=email, role=role)
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class UsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search = request.query_params.get('search', '')
        users = User.objects.exclude(id=request.user.id)

        if search:
            users = users.filter(username__icontains=search)

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)