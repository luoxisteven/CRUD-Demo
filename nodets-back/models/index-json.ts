import { promises as fs } from 'fs';
import path from 'path';
import { TaskData, TaskWithMethods } from '../types/type';

// Data file path
const dataPath: string = path.join(__dirname, '../data/tasks.json');

// Read tasks data
async function readTasks(): Promise<TaskData[]> {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data) as TaskData[];
  } catch (error: any) {
    // Return empty array if file doesn't exist
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write tasks data
async function writeTasks(tasks: TaskData[]): Promise<void> {
  await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
}

// Task model
const Task = {
  // Find all tasks
  findAll: async (): Promise<TaskWithMethods[]> => {
    const tasks = await readTasks();
    return tasks.map(task => Task.attachMethods(task));
  },

  // Find task by ID
  findByPk: async (id: number): Promise<TaskWithMethods | null> => {
    const tasks = await readTasks();
    const task = tasks.find(task => task.id === id);
    return task ? Task.attachMethods(task) : null;
  },

  // Create new task
  create: async (taskData: Omit<TaskData, 'id'>): Promise<TaskWithMethods> => {
    const tasks = await readTasks();
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

    const newTask: TaskData = {
      id: newId,
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status || 'To Do',
    };

    tasks.push(newTask);
    await writeTasks(tasks);
    return Task.attachMethods(newTask);
  },

  // Attach methods to task object
  attachMethods: (taskData: TaskData): TaskWithMethods => {
    return {
      ...taskData,
      // Update task
      update: async (updateData: Partial<TaskData>): Promise<TaskWithMethods> => {
        const tasks = await readTasks();
        const index = tasks.findIndex(t => t.id === taskData.id);

        if (index === -1) throw new Error('Task not found');

        const updatedTask: TaskData = {
          ...tasks[index],
          ...updateData,
        };

        tasks[index] = updatedTask;
        await writeTasks(tasks);
        return Task.attachMethods(updatedTask);
      },

      // Delete task
      destroy: async (): Promise<boolean> => {
        const tasks = await readTasks();
        const filteredTasks = tasks.filter(t => t.id !== taskData.id);

        if (filteredTasks.length === tasks.length) {
          throw new Error('Task not found');
        }

        await writeTasks(filteredTasks);
        return true;
      },
    };
  },
};

// Initialize data storage
async function syncDatabase(): Promise<void> {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(dataPath), { recursive: true });

    // Ensure file exists
    try {
      await fs.access(dataPath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await writeTasks([]);
      } else {
        throw error;
      }
    }

    console.log('Database synchronized');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
}

export { Task, syncDatabase };