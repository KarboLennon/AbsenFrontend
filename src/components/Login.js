import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { TextField, Button, Box, Typography } from '@mui/material';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post('http://159.223.74.201:8080/api/login', {
      username,
      password,
    }).then((response) => {
      const { username, token, role } = response.data;
      login(username, token, role);
      navigate('/'); // Arahkan ke halaman utama setelah login
    }).catch((error) => {
      console.error('Login failed:', error);
      alert('Login gagal, periksa username atau password Anda.');
    });
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
      <Box>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
