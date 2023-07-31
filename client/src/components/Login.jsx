// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      console.log(response.data);
      if(response.data.success) {
        onLogin(response.data.user); // Set user state in App component
        navigate('/');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Invalid username or password.');
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="login-username">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </Form.Group>

      <Form.Group controlId="login-password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Form.Group>

      <Button variant="primary" type="submit">Log In</Button>
      {error && <Alert variant="danger">{error}</Alert>}
    </Form>
  );
}

export default Login;
