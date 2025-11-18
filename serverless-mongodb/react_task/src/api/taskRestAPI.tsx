import { Task, TaskFormData } from '../types/Task';
import config from '../config';

async function fetchWithFallback(path: string, init?: RequestInit): Promise<Response> {
  let lastError: any = null;
  for (const base of config.apiUrls) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (res.ok) return res;
      lastError = new Error(`HTTP ${res.status} ${res.statusText}`);
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError ?? new Error('All API endpoints failed');
}

export const taskApi = {
  // Get all tasks
  async getAll(): Promise<Task[]> {
    const response = await fetchWithFallback(`/task`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    }
    return response.json();
  },

  // Get a task by ID
  async getById(id: number): Promise<Task> {
    const response = await fetchWithFallback(`/task/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task with ID ${id}: ${response.statusText}`);
    }
    return response.json();
  },

  // Create a new task
  async create(task: TaskFormData): Promise<Task> {
    const response = await fetchWithFallback(`/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }
    return response.json();
  },

  // Update a task
  async update(id: number, task: Partial<TaskFormData>): Promise<Task> {
    const response = await fetchWithFallback(`/task/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`Failed to update task with ID ${id}: ${response.statusText}`);
    }
    return response.json();
  },

  // Delete a task
  async delete(id: number): Promise<void> {
    const response = await fetchWithFallback(`/task/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete task with ID ${id}: ${response.statusText}`);
    }
  },
};

// import axios from 'axios';
// import { Task, TaskFormData } from '../types/Task';
// import config from '../config';

// // const API_URL = 'http://localhost:3000/api';

// export const taskApi = {
//   // Get all tasks
//   async getAll(): Promise<Task[]> {
//     const response = await axios.get(`${config.apiUrl}/task`);
//     return response.data;
//   },

//   // Get a task by ID
//   async getById(id: number): Promise<Task> {
//     const response = await axios.get(`${config.apiUrl}/task/${id}`);
//     return response.data;
//   },

//   // Create a new task
//   async create(task: TaskFormData): Promise<Task> {
//     const response = await axios.post(`${config.apiUrl}/task`, task);
//     return response.data;
//   },

//   // Update a task
//   async update(id: number, task: Partial<TaskFormData>): Promise<Task> {
//     const response = await axios.put(`${config.apiUrl}/task/${id}`, task);
//     return response.data;
//   },

//   // Delete a task
//   async delete(id: number): Promise<void> {
//     await axios.delete(`${config.apiUrl}/task/${id}`);
//   }
// };

