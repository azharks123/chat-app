from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'user', UsersListView, basename='chat')

urlpatterns = [
    path('register/', RegisterView.as_view(), name="get-user"),
    path('', include(router.urls)),
]