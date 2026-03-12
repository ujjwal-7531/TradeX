const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
require('./models/index'); // Load associations

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust to frontend URL for production
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Basic health check
app.get('/', (req, res) => {
  res.send('AnonX Backend is running...');
});

// Database Sync and Server Start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Use { force: true } only for development if you want to reset DB
  sequelize.sync({ alter: true }).then(() => {
    console.log('Database Synced.');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
});

// Socket.io basic setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
