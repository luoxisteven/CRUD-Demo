const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

// const config = require('../config/config');
// config.DB_HOST

// Function to create database if it doesn't exist
const createDatabaseIfNotExists = async () => {
  try {
    // Create a connection without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created or already exists`);
    
    // Close the connection
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
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

