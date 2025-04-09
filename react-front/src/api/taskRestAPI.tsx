import axios from 'axios';
import { Task, TaskFormData } from '../types/Task';
import config from '../config';

// const API_URL = 'http://localhost:3000/api';

export const taskApi = {
  // Get all tasks
  async getAll(): Promise<Task[]> {
    const response = await axios.get(`${config.apiUrl}/task`);
    return response.data;
  },

  // Get a task by ID
  async getById(id: number): Promise<Task> {
    const response = await axios.get(`${config.apiUrl}/task/${id}`);
    return response.data;
  },

  // Create a new task
  async create(task: TaskFormData): Promise<Task> {
    const response = await axios.post(`${config.apiUrl}/task`, task);
    return response.data;
  },

  // Update a task
  async update(id: number, task: Partial<TaskFormData>): Promise<Task> {
    const response = await axios.put(`${config.apiUrl}/task/${id}`, task);
    return response.data;
  },

  // Delete a task
  async delete(id: number): Promise<void> {
    await axios.delete(`${config.apiUrl}/task/${id}`);
  }
};