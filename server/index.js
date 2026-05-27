const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://56.228.12.101:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://56.228.12.101:3000"
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/food', require('./routes/food'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'FoodFlow AI API is running', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);
    io.emit('activeUsers', activeUsers.size);
  });

  socket.on('orderUpdate', (data) => {
    io.to(`user_${data.userId}`).emit('orderStatusChanged', data);
  });

  socket.on('trackOrder', (orderId) => {
    socket.join(`order_${orderId}`);
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        break;
      }
    }
    io.emit('activeUsers', activeUsers.size);
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`FoodFlow AI Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

module.exports = { app, server, io };
