# Tasks Angular Frontend
A simple, minimalistic Angular TypeScript frontend application for managing tasks. This frontend connects to any backend switching between RestAPI and GraphQL to perform CRUD operations on tasks.

## Features

- View all tasks in a clean tabular layout
- Add new tasks with title, description, and status
- Edit existing tasks
- Delete tasks
- Simple and intuitive user interface
- Minimal dependencies

## Create
```bash
# Install and verify
npm install -g @angular/cli
ng version

# Create a new Angular project
ng new angular-front
```

## Run
```bash
ng serve 
# or
npm start
```

## Add Components / Services
```bash
# Add Components
ng generate component components/task-list

# Add Services
ng generate service services/task
```

## Building for Production
``` bash
ng build --prod
```