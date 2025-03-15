const fs = require('fs').promises;
const path = require('path');

// 数据文件路径
const dataPath = path.join(__dirname, '../data/tasks.json');

// 确保目录存在
const ensureDirectoryExists = async () => {
  const dir = path.dirname(dataPath);
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Directory ${dir} created or already exists`);
  } catch (error) {
    console.error('Error creating directory:', error);
    throw error;
  }
};

// 读取任务数据
const readTasks = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回空数组
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// 写入任务数据
const writeTasks = async (tasks) => {
  await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
};

// Task 模型
const Task = {
  // 查找所有任务
  findAll: async () => {
    return await readTasks();
  },

  // 通过ID查找任务
  findByPk: async (id) => {
    const tasks = await readTasks();
    return tasks.find(task => task.id === parseInt(id)) || null;
  },

  // 创建新任务
  create: async (taskData) => {
    const tasks = await readTasks();
    
    // 生成新ID (取最大ID + 1或从1开始)
    const newId = tasks.length > 0 
      ? Math.max(...tasks.map(task => task.id)) + 1 
      : 1;
    
    const now = new Date();
    const newTask = {
      id: newId,
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status || 'To Do',
      createdAt: now,
      updatedAt: now
    };
    
    tasks.push(newTask);
    await writeTasks(tasks);
    return newTask;
  },

  // 更新任务
  update: async function(taskData) {
    const tasks = await readTasks();
    const index = tasks.findIndex(task => task.id === this.id);
    
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    // 更新任务
    const updatedTask = {
      ...tasks[index],
      title: taskData.title || tasks[index].title,
      description: taskData.description !== undefined ? taskData.description : tasks[index].description,
      status: taskData.status || tasks[index].status,
      updatedAt: new Date()
    };
    
    tasks[index] = updatedTask;
    await writeTasks(tasks);
    return updatedTask;
  },

  // 删除任务
  destroy: async function() {
    const tasks = await readTasks();
    const updatedTasks = tasks.filter(task => task.id !== this.id);
    
    if (updatedTasks.length === tasks.length) {
      throw new Error('Task not found');
    }
    
    await writeTasks(updatedTasks);
    return true;
  }
};

// 初始化数据存储
const syncDatabase = async () => {
  try {
    // 确保目录存在
    await ensureDirectoryExists();
    
    // 确保文件存在
    try {
      await fs.access(dataPath);
    } catch (error) {
      // 如果文件不存在，创建一个空的JSON数组
      if (error.code === 'ENOENT') {
        await writeTasks([]);
        console.log(`Created empty tasks file at ${dataPath}`);
      } else {
        throw error;
      }
    }
    
    console.log('JSON storage ready');
  } catch (error) {
    console.error('Error initializing JSON storage:', error);
    throw error;
  }
};

module.exports = { Task, syncDatabase };