# Tasks React Frontend

A simple, minimalistic React TypeScript frontend application for managing tasks. This frontend connects to a Node.js backend switching between RestAPI and GraphQL to perform CRUD operations on tasks.

## Layout
![image](../img/website.jpg)

## Features

- View all tasks in a clean tabular layout
- Add new tasks with title, description, and status
- Edit existing tasks
- Delete tasks
- Simple and intuitive user interface
- Minimal dependencies

## Tech Stack

- React 18
- TypeScript
- Vite (for fast development and building)
- CSS (plain, no frameworks)
- RestAPI / GraphQL

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

2. Configuration (`src/config.tsx`):

    1) In `src/api/taskApi.ts`, make sure the `API_URL` constant points to your backend API:
        ```typescript
        const API_URL = 'http://localhost:3000/api';
        ```
    2) Choose your apitype (either `restapi` or `graphql`)
        ```typescript
        apiType: 'restapi', // 'restapi' or 'graphql'
        ```

## Initialize the project
```bash
# Upgrade your node
nvm install --lts

npm create vite@latest ts-front -- --template react-ts
cd ts-front
npm install
```

## Install router dependencies (optional for router)
```bash
npm install axios
npm install react-router-dom @types/react-router-dom
```


## Building for Production
```bash
npm run build
```

## Run
```bash
npm run dev
```