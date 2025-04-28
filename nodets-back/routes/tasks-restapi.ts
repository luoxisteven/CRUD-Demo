import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { TaskData } from '../types/type';

// Load environment variables
dotenv.config();

const router = express.Router();

// Import the Task model based on the DB_TYPE
const DB_TYPE = process.env.DB_TYPE || 'json';
const { Task }: { Task: { findAll: () => Promise<TaskData[]>; findByPk: (id: string) => Promise<TaskData | null>; create: (data: Partial<TaskData>) => Promise<TaskData> } } = require(`../models/index-${DB_TYPE}`);

// GET all tasks
router.get('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const tasks: TaskData[] = await Task.findAll();
    return res.json(tasks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// GET task by ID
router.get('/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const task: TaskData | null = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(task);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// CREATE new task
router.post('/', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newTask: TaskData = await Task.create({
      title,
      description,
      status: status || 'To Do',
    });

    return res.status(201).json(newTask);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// UPDATE task
router.put('/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { title, description, status } = req.body;
    const task: TaskData | null = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask: TaskData = await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
    });

    return res.json(updatedTask);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// DELETE task
router.delete('/:id', async (req: Request, res: Response): Promise<Response> => {
  try {
    const task: TaskData | null = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    return res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;