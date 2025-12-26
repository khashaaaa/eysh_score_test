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
    <div className="login" style={{ fontFamily: 'Times New Roman, serif', backgroundColor: '#ffffff', color: '#333333', padding: '20px', border: '1px solid #cccccc', maxWidth: '400px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline', textAlign: 'center' }}>Admin Login</h2>
      <div style={{ textAlign: 'center' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', margin: '10px auto', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', margin: '10px auto', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
        />
        <button onClick={handleLogin} style={{ display: 'block', margin: '20px auto', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;