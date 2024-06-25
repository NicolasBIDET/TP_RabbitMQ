import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import { Link } from 'react-router-dom';

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (message.sender._id === selectedUser || message.receiver._id === selectedUser) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
    return () => socket.off('newMessage');
  }, [selectedUser]);

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data.filter(message => message.receiver._id === userId || message.sender._id === userId));
      setSelectedUser(userId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post('http://localhost:5000/api/messages/send', {
        receiver: selectedUser,
        content: messageContent
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessageContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="user-list">
        <h3>Users</h3>
        <ul>
          {users.map(user => (
            <li key={user._id} onClick={() => fetchMessages(user._id)}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div className="message-list">
        <h3>Messages</h3>
        <ul>
          {messages.map(message => (
            <li key={message._id}>{message.sender.username}: {message.content}</li>
          ))}
        </ul>
        <div className="message-input">
          <input type="text" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      <Link to="/login">Logout</Link>
    </div>
  );
};

export default Chat;
