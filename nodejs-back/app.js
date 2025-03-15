const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./models/index');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

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
      console.log(`Server running on port ${PORT}`);
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