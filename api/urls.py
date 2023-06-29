from django.urls import path
from .views import union_badge

urlpatterns = [
    path('union_badge', union_badge)
]