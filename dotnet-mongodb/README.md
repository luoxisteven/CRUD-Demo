# Task Manager - .Net
A simple RESTful API for task management built with .NET 8 and MongoDB.

## Features

- Create, Read, Update, and Delete (CRUD) operations for tasks
- MongoDB database integration with Entity Framework Core
- Clean architecture with separate Models, Controllers, and Services
- Automatic database creation

## Prerequisites

- .NET 8 SDK
- MongoDB Server

## Project Structure

- **Controllers/** - API controllers handling HTTP requests
- **Models/** - Data models and DTOs
- **Services/** - Business logic and data access

## Getting Started

1. Configure the database connection in `Program.cs`
```csharp
builder.Services.AddSingleton<IMongoClient>(new MongoClient("mongodb://localhost:27017"));
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

# add basic packages
dotnet add package Microsoft.EntityFrameworkCore --version 8.0.13
dotnet add package Microsoft.EntityFrameworkCore.Relational --version 8.0.13

# add MongoDB Driver
dotnet add package MongoDB.Driver
```

## API Endpoints

| Method | Endpoint      | Description         |
|--------|---------------|---------------------|
| GET    | /api/task      | Get all tasks       |
| GET    | /api/task/{id} | Get task by ID      |
| POST   | /api/task      | Create a new task   |
| PUT    | /api/task/{id} | Update an existing task |
| DELETE | /api/task/{id} | Delete a task       |