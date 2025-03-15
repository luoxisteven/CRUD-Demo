import { useState, useEffect, useCallback } from 'react';
import { Task, TaskFormData } from '../types/Task';
import { taskApi } from '../api/taskApi';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskApi.getAll();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    }
  }, []);

  // Create a new task
  const createTask = async (taskData: TaskFormData): Promise<Task> => {
    try {
      const newTask = await taskApi.create(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    }
  };

  // Update a task
  const updateTask = async (id: number, taskData: Partial<TaskFormData>): Promise<Task> => {
    try {
      const updatedTask = await taskApi.update(id, taskData);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id: number): Promise<void> => {
    try {
      await taskApi.delete(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};