from django.urls import path
from . import views

urlpatterns = [
    path('task', views.tasks, name='tasks'),  # Handles GET (list) and POST (create)
    path('task/<int:task_id>', views.task_detail, name='task_detail'),  # Handles GET (retrieve), PUT/PATCH (update), DELETE (delete)
]