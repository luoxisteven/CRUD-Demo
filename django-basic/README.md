# Task Manager - Django
A simple RESTful API for task management built with Django.

## Features

- Create, Read, Update, and Delete (CRUD) operations for tasks
- SQLite / MySQL / MongoDB Database Integration

## Prerequisites
- Python
- Django
- django-cors-headers
- MySQL: mysqlclient
- MongoDB: djongo, pymongo

## Init
```bash
# Install django
pip install django

# Create a new Django project "django_back"
django-admin startproject django_back
# Configure settings.py "ALLOWED_HOSTS = ["*"]"

# Create a new app
cd django_back
python manage.py startapp task
# Configure settings.py "INSTALLED_APPS" for app "task"

# Run initial migrations (Init sqlite database)
python manage.py migrate

# CORS
pip install django-cors-headers
# Configure settings.py "INSTALLED_APPS", "MIDDLEWARE", "CORS_ALLOW_ALL_ORIGINS" for CORS

# For MySQL
# pip install mysqlclient

# For Django: djongo pymongo
# pip install djongo pymongo

# If you finish coding models.py
python manage.py makemigrations
python manage.py migrate
```

### Configure (django/django_back/settings.py)
``` python
# Configure your database choice here.
# !!IMPORTANT: Choose your database here. Options: "MySQL", "MongoDB", "SQLite"
DATABASE_CHOICE = "MySQL" 
```

## Run
``` bash
# Init db.sqlite3
python manage.py makemigrations
python manage.py migrate

# Run
python manage.py runserver 3000
```

## API Endpoints

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| GET    | /api/task      | Get all tasks       |
| GET    | /api/task/{id} | Get task by ID      |
| POST   | /api/task      | Create a new task   |
| PUT    | /api/task/{id} | Update an existing task |
| DELETE | /api/task/{id} | Delete a task       |
