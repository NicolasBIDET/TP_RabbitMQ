const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const connectRabbitMQ = require('./rabbitmq');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/chat-app')
    .then(() => {
        console.log('Connected to MongoDB');
        startServer();
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const startServer = () => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  startRabbitMQ(io);
};

const startRabbitMQ = async (io) => {
  try {
    const channel = await connectRabbitMQ();
    channel.consume('chat_messages', (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        io.emit('newMessage', message);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
