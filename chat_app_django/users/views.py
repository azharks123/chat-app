from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import UserSerializer, CustomTokenObtainPairSerializer
from chat.models import Chat
User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"detail": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

class UsersListView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        search = self.request.query_params.get('search', '')
        queryset = User.objects.exclude(id=self.request.user.id)
        if search:
            queryset = queryset.filter(username__icontains=search)
        return queryset

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()

        if user == request.user:
            return Response({"detail": "You cannot delete yourself."}, status=status.HTTP_400_BAD_REQUEST)

        user_chats = Chat.objects.filter(members=user)
        for chat in user_chats:
            if chat.members.count() == 2:
                chat.delete()
            else:
                chat.members.remove(user)

        user.delete()
        return Response({"detail": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
