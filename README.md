# Multi-Stack CRUD Demo

A demonstration project featuring Docker and Kubernetes orchestration scripts, along with serverless backend deployment, showcasing basic CRUD (Create, Read, Update, Delete) operations with the flexibility to switch between different backend frameworks, databases, and API patterns while maintaining a consistent frontend. The repository includes comprehensive commands for container orchestration and cloud-native deployments, with minimalistic code and minimal package dependencies, specifically designed for interview scenarios and technical assessments.

- @Author: Steven Luo
- @Email: steven@xiluo.net
- @Website: [crud.xiluo.net](https://crud.xiluo.net)

## Documentations
- Docker and Kubernetes
  - [Docker and Kubernetes Documentation](k8s/docker&k8s.md)
- Backend
  - Serverless
      - [AWS Lambda Serverless with AWS RDS](serverless-mysql/Serverless.md)
      - [AWS Lambda Serverless with AWS VPC and MongoDB](serverless-mongodb/Serverless.md)
  - Dotnet
      - [.NET and In-Memory DB](dotnet-inmemorydb/README.md)
      - [.NET and JSON](dotnet-json/README.md)
      - [.NET and MySQL](dotnet-mysql/README.md)
      - [.NETand MongoDB n](dotnet-mongodb/README.md)
  - Django
      - [Django Basic](django-basic/README.md)
      - [Django with Rest Framework Package](django-restframework/README.md)
  - Node.js
      - [Node.js Documentation](nodejs-back/README.md)
- Frontend
  - React
    - [React Documentation](react-front/README.md)
  - Angular
    - [Angular Frontend Documentation](angular-front/README.md)

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

## Website Layout
![image](artifacts/website.jpg)