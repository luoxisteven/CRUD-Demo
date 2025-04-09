const fs = require('fs').promises;
const path = require('path');

// Data file path
const dataPath = path.join(__dirname, '../data/tasks.json');

// Read tasks data
async function readTasks() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty array if file doesn't exist
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write tasks data
async function writeTasks(tasks) {
  await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
}

// Task model
const Task = {
  // Find all tasks
  findAll: async () => {
    const tasks = await readTasks();
    return tasks.map(task => Task.attachMethods(task));
  },

  // Find task by ID
  findByPk: async (id) => {
    const tasks = await readTasks();
    const task = tasks.find(task => task.id === parseInt(id));
    return task ? Task.attachMethods(task) : null;
  },

  // Create new task
  create: async (taskData) => {
    const tasks = await readTasks();
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    
    const newTask = {
      id: newId,
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status || 'To Do',
      // createdAt: new Date(),
      // updatedAt: new Date()
    };
    
    tasks.push(newTask);
    await writeTasks(tasks);
    return Task.attachMethods(newTask);
  },

  // Attach methods to task object
  attachMethods: (taskData) => {
    return {
      ...taskData,
      // Update task
      update: async (updateData) => {
        const tasks = await readTasks();
        const index = tasks.findIndex(t => t.id === taskData.id);
        
        if (index === -1) throw new Error('Task not found');
        
        const updatedTask = {
          ...tasks[index],
          ...updateData,
          // updatedAt: new Date()
        };
        
        tasks[index] = updatedTask;
        await writeTasks(tasks);
        return Task.attachMethods(updatedTask);
      },

      // Delete task
      destroy: async () => {
        const tasks = await readTasks();
        const filteredTasks = tasks.filter(t => t.id !== taskData.id);
        
        if (filteredTasks.length === tasks.length) {
          throw new Error('Task not found');
        }
        
        await writeTasks(filteredTasks);
        return true;
      }
    };
  }
};

// Initialize data storage
async function syncDatabase() {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    
    // Ensure file exists
    try {
      await fs.access(dataPath);
    } catch (error) {
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

module.exports = { Task, syncDatabase };