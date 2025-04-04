# CRUD-Demo

A demonstration project showcasing basic CRUD (Create, Read, Update, Delete) operations implemented with the ability to switch between different backend frameworks, databases, and API patterns while maintaining a consistent frontend. This repository features minimalistic code and package usage, designed for interview scenarios and code tests.

- @Author: Steven Luo
- @Email: steven@xiluo.net

## Website Layout
![image](img/website.jpg)

## TO DO
1) Django
2) GraphQL

## System Architecture

- **Backend Options**: 
  - .NET Core
  - Node.js/Express
  - Django

- **Frontend**: React with TypeScript
- **Database**: MySQL, MongoDB, JSON

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
- [React Frontend Documentation](react-front/README.md)

## Purpose

This project demonstrates how the same functionality can be implemented across different backend frameworks while maintaining identical API interfaces and frontend interactions. It serves as a practical comparison of implementation patterns across technologies.