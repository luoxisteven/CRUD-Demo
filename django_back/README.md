# Task Manager - Django

## Init
```bash
# Install django
pip install django

# Create a new Django project
django-admin startproject django_back

# Create a new app
cd django_back
python manage.py startapp task

# Run initial migrations (Init sqlite database)
python manage.py migrate

# CORS
pip install django-cors-headers
```