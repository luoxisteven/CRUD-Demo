from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Task
from .serializers import TaskSerializer

@api_view(['GET', 'POST'])
def tasks(request):
    if request.method == 'GET':
        # List all tasks
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        # Create a new task
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def task_detail(request, task_id):
    # Retrieve the task or return 404 if not found
    task = get_object_or_404(Task, id=task_id)

    if request.method == 'GET':
        # Retrieve a specific task
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        # Update a specific task
        serializer = TaskSerializer(task, data=request.data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({"error": "Invalid JSON data"}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Delete a specific task
        task.delete()
        return Response({"message": "Task deleted successfully"}, status=status.HTTP_204_NO_CONTENT)