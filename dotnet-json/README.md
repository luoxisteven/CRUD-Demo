# Task Manager - .Net
A simple RESTful API for task management built with .NET 8 and Json.

## Features

- Create, Read, Update, and Delete (CRUD) operations for tasks
- JSON integration with Entity Framework Core
- Clean architecture with separate Models, Controllers, and Services
- Automatic database creation

## Prerequisites

- .NET 8 SDK
- JSON Knowledge

## Project Structure

- **Controllers/** - API controllers handling HTTP requests
- **Models/** - Data models and DTOs
- **Services/** - Business logic and data access

## Getting Started

1. Configure the path of JSON database in `appsettings.json`
```json
"TaskFilePath": "data/tasks.json"
```

2. Run the appliction:
```bash
dotnet run
```

## Init
``` bash
# dotnet webapi
cd dotnet-back
dotnet new webapi

# add packages
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.13
dotnet add package Microsoft.EntityFrameworkCore.Relational --version 8.0.13
```

## API Endpoints

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| GET    | /api/task      | Get all tasks       |
| GET    | /api/task/{id} | Get task by ID      |
| POST   | /api/task      | Create a new task   |
| PUT    | /api/task/{id} | Update an existing task |
| DELETE | /api/task/{id} | Delete a task       |