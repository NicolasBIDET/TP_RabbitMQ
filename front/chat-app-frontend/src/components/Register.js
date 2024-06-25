import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/users/register', { username, password });
      alert('User registered');
    } catch (error) {
      console.error('Register error:', error);
      // Gérer les erreurs d'enregistrement ici (par exemple, afficher un message à l'utilisateur)
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
