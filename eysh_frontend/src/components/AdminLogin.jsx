import React, { useState, useContext } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/admin/login', { email: email.trim(), password: password.trim() });
      login(res.data.token);
      navigate('/admin');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login">
      <h2>Admin Login</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;