# Task Manager - .Net
A simple RESTful API for task management built with .NET 8 and In-Memory Database.

## Features

- Create, Read, Update, and Delete (CRUD) operations for tasks
- In-Memory database integration with Entity Framework Core
- Clean architecture with separate Models, Controllers, and Services
- Automatic database creation

## Prerequisites

- .NET 8 SDK

## Project Structure

- **Controllers/** - API controllers handling HTTP requests
- **Models/** - Data models and DTOs
- **Services/** - Business logic and data access

## Getting Started
```bash
dotnet run
```

## Init
``` bash
# dotnet webapi
mkdir dotnet-back
cd dotnet-back
dotnet new webapi

# add packages
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Relational

# add package for InMemoryDatabase
dotnet add package Microsoft.EntityFrameworkCore.InMemory
```

## Notice
``` bash
# Remember to modify your port in `Properties/launchSettings.json`
 "applicationUrl": "http://localhost:8888",
```

## API Endpoints

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| GET    | /api/task      | Get all tasks       |
| GET    | /api/task/{id} | Get task by ID      |
| POST   | /api/task      | Create a new task   |
| PUT    | /api/task/{id} | Update an existing task |
| DELETE | /api/task/{id} | Delete a task       |