const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2/promise');
const config = require('../config/config').development;

// Function to create database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  try {
    // Create a connection without specifying a database
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password
    });
    
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    console.log(`Database ${config.database} created or already exists`);
    
    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

// Define Task model
// Datatypes: DataTypes.STRING, DataTypes.BOOLEAN, DataTypes.INTEGER, DataTypes.FLOAT, DataTypes.DATE
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
    defaultValue: 'To Do'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  timestamps: true // createdAt, updatedAt
});

// Sync database
const syncDatabase = async () => {
  try {
    // First create database if needed
    await createDatabaseIfNotExists();
    
    // Then sync models with database
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

module.exports = { sequelize, Task, syncDatabase };

// Equals to
// module.exports.sequelize = sequelize;
// module.exports.Task = Task;
// module.exports.syncDatabase = syncDatabase;


// Below will lead to module.exports = syncDatabase;
// module.exports = sequelize, Task, syncDatabase;

