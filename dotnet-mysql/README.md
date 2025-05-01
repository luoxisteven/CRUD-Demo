# Task Manager - .Net
A simple RESTful API for task management built with .NET 8 and MySQL.

## Features

- Create, Read, Update, and Delete (CRUD) operations for tasks
- MySQL database integration with Entity Framework Core
- Clean architecture with separate Models, Controllers, and Services
- Automatic database creation

## Prerequisites

- .NET 8 SDK
- MySQL Server

## Project Structure

- **Controllers/** - API controllers handling HTTP requests
- **Models/** - Data models and DTOs
- **Services/** - Business logic and data access

## Getting Started

1. Configure the database connection in `appsettings.json`
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;user=root;password=password;database=task_manager"
  }
}
```

2. Run the appliction:
```bash
dotnet run
```

## Init
``` bash
# dotnet webapi
mkdir dotnet-back
cd dotnet-mysql
dotnet new webapi

# add packages
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.13
dotnet add package Microsoft.EntityFrameworkCore.Relational --version 8.0.13
dotnet add package Pomelo.EntityFrameworkCore.MySql --version 8.0.3
```

## Notice
``` bash
# Remember to modify your port in `Properties/launchSettings.json`
 "applicationUrl": "http://localhost:3000",
```

## API Endpoints

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| GET    | /api/task      | Get all tasks       |
| GET    | /api/task/{id} | Get task by ID      |
| POST   | /api/task      | Create a new task   |
| PUT    | /api/task/{id} | Update an existing task |
| DELETE | /api/task/{id} | Delete a task       |