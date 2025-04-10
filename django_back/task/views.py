from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
import json
from .models import Task

# Handle GET (list) and POST (create) for /tasks/
@csrf_exempt
def tasks(request):
    if request.method == 'GET':
        # List all tasks
        tasks = list(Task.objects.values('id', 'title', 'description', 'status'))
        return JsonResponse(tasks, safe=False)
    elif request.method == 'POST':
        # Create a new task
        try:
            data = json.loads(request.body)
            title = data.get('title')
            description = data.get('description')
            status = data.get('status', 'to_do')

            if not title:
                return JsonResponse({"error": "Title cannot be empty"}, status=400)

            task = Task.objects.create(
                title=title,
                description=description,
                status=status
            )

            return JsonResponse({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    return JsonResponse({"error": "Method Not Allowed"}, status=405)

# Handle GET (retrieve), PUT/PATCH (update), DELETE for /tasks/<task_id>/
@csrf_exempt
def task_detail(request, task_id):
    try:
        task = Task.objects.get(id=task_id)
    except ObjectDoesNotExist:
        return JsonResponse({"error": "Task not found"}, status=404)

    if request.method == 'GET':
        # Retrieve a specific task
        return JsonResponse({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status
        })

    elif request.method in ['PUT', 'PATCH']:
        # Update a specific task
        try:
            data = json.loads(request.body)
            if 'title' in data:
                task.title = data['title']
            if 'description' in data:
                task.description = data['description']
            if 'status' in data:
                task.status = data['status']
            task.save()

            return JsonResponse({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status
            })
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    elif request.method == 'DELETE':
        # Delete a specific task
        task.delete()
        return JsonResponse({"message": "Task deleted successfully"}, status=204)

    return JsonResponse({"error": "Method Not Allowed"}, status=405)