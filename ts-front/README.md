# Tasks React Frontend

A simple, minimalistic React TypeScript frontend application for managing tasks. This frontend connects to a Node.js REST API backend to perform CRUD operations on tasks.

## Layout
![image](../img/website.jpg)

## Features

- View all tasks in a clean tabular layout
- Create new tasks with title, description, and status
- Edit existing tasks
- Delete tasks
- Simple and intuitive user interface
- Minimal dependencies

## Tech Stack

- React 18
- TypeScript
- Vite (for fast development and building)
- CSS (plain, no frameworks)

## Project Structure

``` bash
src/
├── api/
│   └── taskApi.ts         # API client for backend communication
├── hooks/
│   └── useTasks.ts        # Custom hook for task state management
├── pages/
│   └── Home.tsx           # Main page component
├── types/
│   └── Task.ts            # TypeScript type definitions
├── App.css                # Global styles
├── App.tsx                # Root component
└── main.tsx               # Application entry point
```

## Setup and Installation
1. Install dependencies:
```bash
npm install
```

2. Configure the API URL:
In `src/api/taskApi.ts`, make sure the `API_URL` constant points to your backend API:
```typescript
const API_URL = 'http://localhost:3000/api';
```

## Initialize the project
```bash
npm create vite@latest ts-front -- --template react-ts
cd ts-front
npm install

## From Beginning
npm install axios
```

## Install essential dependencies
```bash
npm install axios react-router-dom @types/react-router-dom
```


## Building for Production
```bash
npm run build
```

## Run
```bash
npm run dev
```