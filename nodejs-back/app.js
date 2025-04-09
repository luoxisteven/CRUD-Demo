// Configure Backend
require('dotenv').config();
const DB_TYPE = process.env.DB_TYPE || 'json';
const API_TYPE = process.env.API_TYPE || 'rest';
const PORT = process.env.PORT || 3000;
// const { syncDatabase } = require('./models/index-mysql');
// const taskRoutes = require('./routes/tasks-rest');
const { syncDatabase } = require(`./models/index-${DB_TYPE}`);
const taskRoutes = require(`./routes/tasks-${API_TYPE}`);


const express = require('express');
const cors = require('cors');

// Create App
const app = express();
// CORS Middleware
app.use(cors());
// Middleware
app.use(express.json());
// Routes
app.use('/api/tasks', taskRoutes);

// Sync database and start server
syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`=========Server running on port ${PORT}=========`);
      console.log(`=======Server running with ${DB_TYPE} and ${API_TYPE}========`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });


// 不使用 =>
// syncDatabase()
//   .then(function() {
//     app.listen(PORT, function() {
//       console.log('Server running on port ' + PORT);
//     });
//   })
//   .catch(function(err) {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   });

// 也可以这样
// async function startServer() {
//   try {
//     await syncDatabase();
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error('Failed to start server:', err);
//     process.exit(1);
//   }
// }

// startServer();