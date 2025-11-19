# CRUD-Demo

A demonstration project showcasing basic CRUD (Create, Read, Update, Delete) operations implemented with the ability to switch between different backend frameworks, databases, and API patterns while maintaining a consistent frontend. It also includes script and commands on `Docker and Kubernetes` services and `Severless` backend. This repository features minimalistic code and package usage, designed for interview scenarios and code tests.

- @Author: Steven Luo
- @Email: steven@xiluo.net
- @Website: [crud.xiluo.net](https://crud.xiluo.net)

## Documentation
- Docker and Kubernetes
  - [Docker and Kubernetes Documentation](k8s/docker&k8s.md)
- Backend
  - Serverless
      - [AWS Lambda Serverless with AWS RDS Documentation](serverless-mysql/Serverless.md)
      - [AWS Lambda Serverless with AWS VPC linking with Server's DB Documentation](serverless-mongodb/Serverless.md)
  - Dotnet
      - [.NET Backend and In-Memory DB Documentation](dotnet-inmemorydb/README.md)
      - [.NET Backend and JSON Documentation](dotnet-json/README.md)
      - [.NET Backend and MySQL Documentation](dotnet-mysql/README.md)
      - [.NET Backend and MongoDB Documentation](dotnet-mongodb/README.md)
  - Django
      - [Django Backend Basic](django-basic/README.md)
      - [Django Backend with Rest Framework Package](django-restframework/README.md)
  - Node.js
      - [Node.js Backend Documentation](nodejs-back/README.md)
- Frontend
  - React
    - [React Frontend Documentation](react-front/README.md)
  - Angular
    - [Angular Frontend Documentation](angular-front/README.md)

## Website Layout
![image](artifacts/website.jpg)

## System Architecture

- **Backend Options**: 
  - .NET Core
  - Node.js/Express
  - Django
  - Serverless (AWS Lambda)
- **Frontend Options**: 
  - React with TypeScript
  - Angular with TypeScript
- **Database Options**: 
  - MySQL 
  - MongoDB
    - Django Limited
  - JSON 
    - Node.js and .NET only
  - SQLite 
    - Django Only
  - In-Memory Database 
    - .NET Only
- **API Options**: 
  - RestAPI
  - GraphQL
- **Docker**
- **Container Registry**
- **Kubernetes**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/task | Retrieve all tasks |
| GET | /api/task/:id | Retrieve a specific task by ID |
| POST | /api/task | Create a new task |
| PUT | /api/task/:id | Update an existing task |
| DELETE | /api/task/:id | Delete a task |

## Task Model

**Each task contains:**
- Title (string)
- Description (text)
- Status (To Do, In Progress, Done)
- Created and updated timestamps