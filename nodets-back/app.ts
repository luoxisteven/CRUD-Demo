// Import required modules
import dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Environment variables with defaults
const DB_TYPE: string = process.env.DB_TYPE || 'json';
const API_TYPE: string = process.env.API_TYPE || 'rest';
const PORT: number = parseInt(process.env.PORT || '8888', 10);

// Dynamically import database sync and routes
const { syncDatabase } = require(`./models/index-${DB_TYPE}`);
const taskRoutes = require(`./routes/tasks-${API_TYPE}`);

// Create Express app
const app: Application = express();

// CORS Middleware
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api/task', taskRoutes);

// Sync database and start server
syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=========Server running on port ${PORT}=========`);
      console.log(`=======Server running with ${DB_TYPE} and ${API_TYPE}========`);
    });
  })
  .catch((err: Error) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });