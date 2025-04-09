# Task Manager - Node.js

A simple RESTful API for task management built with Node.js, Express.js and Database MySQL, or MongoDB, or JSON.

## Features

- Create, Read, Update, and Delete (CRUD) operations for tasks
- RESTful API design
- Automatic database creation and setup
- Minimal dependencies

## Task Model

Each task includes:
- **Title**: Short text describing the task
- **Description**: Longer text with details
- **Status**: One of "To Do", "In Progress", or "Done"

## Prerequisites

- Node.js (by default)
- MySQL (by default)
- or MongoDB
- or JSON

## Installation

1. Install dependencies:
``` bash
npm install
```

2. Configure the database:
   - Open `.env.example`
   - Modify the Database connection settings (username, password, host) to match your environment
   - Choose your database type
   - Change filename of `.env.example` to `.env`

3. Start the server:
```bash
npm start
```

The server will automatically create the database if it doesn't exist and set up the required tables.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get a specific task by ID |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update an existing task |
| DELETE | /api/tasks/:id | Delete a task |

## API Usage Examples

### Create a Task

**Request:**
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management API",
  "status": "In Progress"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task management API",
  "status": "In Progress",
  "createdAt": "2025-03-15T10:30:00.000Z",
  "updatedAt": "2025-03-15T10:30:00.000Z"
}
```

### Get All Tasks

**Request:**
```http
GET /api/tasks
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task management API",
    "status": "In Progress",
    "createdAt": "2025-03-15T10:30:00.000Z",
    "updatedAt": "2025-03-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "title": "Test API",
    "description": "Test all API endpoints",
    "status": "To Do",
    "createdAt": "2025-03-15T10:35:00.000Z",
    "updatedAt": "2025-03-15T10:35:00.000Z"
  }
]
```

## Project Structure
```
task-manager-api/
├── app.js              # Main application entry point
├── config/
│   └── config.js       # Database configuration
├── models/
│   └── index.js        # Database models and connection
├── routes/
│   └── tasks.js        # API routes for tasks
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## Dependencies
```bash
npm install express mysql2 sequelize dotenv cors mongoose
```
- Express.js: Web framework
- MySQL2: MySQL database driver
- Sequelize: ORM for MySQL database interactions
- Mongoose: ORM for MongoDB interactions
- Dotenv: Configuration management
- Express-GraphQL: Create GraphQL API
- Cors: For cross-origin resource sharing (CORS)