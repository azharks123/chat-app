from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name="get-user"),
    path('get-user/', UsersListView.as_view(), name="get-user-list"),
]