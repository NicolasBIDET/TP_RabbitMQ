const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');
const connectRabbitMQ = require('../rabbitmq');

const router = express.Router();

const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.substring(7); // Récupère le token sans 'Bearer '
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

router.post('/send', authenticate, async (req, res) => {
  const { receiver, content } = req.body;
  try {
    const message = new Message({ sender: req.userId, receiver, content });
    await message.save();
    const channel = await connectRabbitMQ();
    channel.sendToQueue('chat_messages', Buffer.from(JSON.stringify(message)));
    res.status(201).send('Message sent');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(400).json({ error: 'Failed to send message' });
  }
});

router.get('/conversations', authenticate, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { receiver: req.userId }],
    }).populate('sender receiver', 'username');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(400).json({ error: 'Failed to fetch conversations' });
  }
});

module.exports = router;
