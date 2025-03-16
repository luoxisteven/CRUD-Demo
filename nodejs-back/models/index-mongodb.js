const mongoose = require('mongoose');
require('dotenv').config();

// Connect to Database
const syncDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB successfully`);
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

// Task Schema & Model
// type: Number, Date, Boolean
const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Done'],
    default: 'To Do'
  }
}, { timestamps: true}));

// Sequelize-compatible API methods
Task.findAll = async () => Task.find().sort({ createdAt: -1 });
// Task.findAll = async function() {
//   return await Task.find().sort({ createdAt: -1 });
// };
Task.findByPk = async (id) => Task.findById(id);
// Task.findByPk = async function(id) {
//   return await Task.findById(id);
// };
Task.prototype.update = async function(data) {
  Object.assign(this, data);
  return this.save();
};
Task.prototype.destroy = async function() {
  return this.deleteOne();
};

module.exports = { mongoose, Task, syncDatabase };