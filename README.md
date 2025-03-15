# CRUD-Demo

A demonstration project showcasing basic CRUD (Create, Read, Update, Delete) operations implemented with different backend frameworks while maintaining a consistent frontend. This repo features minimalistic code and package usage, designed for interview scenarios and code tests.

## Website Layout
![image](img/website.jpg)

## System Architecture

- **Backend Options**: 
  - .NET Core
  - Node.js/Express
  - Django

- **Frontend**: React with TypeScript

- **Database**: MySQL

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Retrieve all tasks |
| GET | /api/tasks/:id | Retrieve a specific task by ID |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update an existing task |
| DELETE | /api/tasks/:id | Delete a task |

## Task Model

Each task contains:
- Title (string)
- Description (text)
- Status (To Do, In Progress, Done)
- Created and updated timestamps

## Documentation

- [.NET Backend Documentation](dotnet-back/README.md)
- [Node.js Backend Documentation](nodejs-back/README.md)
- [React Frontend Documentation](ts-front/README.md)

## Purpose

This project demonstrates how the same functionality can be implemented across different backend frameworks while maintaining identical API interfaces and frontend interactions. It serves as a practical comparison of implementation patterns across technologies.