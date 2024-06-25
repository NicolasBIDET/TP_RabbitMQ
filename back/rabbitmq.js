const amqp = require('amqplib');

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('chat_messages');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
  }
};

module.exports = connectRabbitMQ;