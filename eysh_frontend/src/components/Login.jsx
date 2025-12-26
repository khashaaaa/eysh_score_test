import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:3000/auth/send-otp', { email: email.trim() });
      setStep('otp');
      alert('OTP sent to your email');
    } catch (error) {
      alert('Error sending OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:3000/auth/verify-otp', { email: email.trim(), otp: otp.trim() });
      login(res.data.token);
      navigate('/');
    } catch (error) {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="login" style={{ fontFamily: 'Times New Roman, serif', backgroundColor: '#ffffff', color: '#333333', padding: '20px', border: '1px solid #cccccc', maxWidth: '400px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline', textAlign: 'center' }}>User Login</h2>
      {step === 'email' ? (
        <div style={{ textAlign: 'center' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', margin: '10px auto', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
          />
          <button onClick={sendOtp} style={{ display: 'block', margin: '20px auto', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Send OTP</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ display: 'block', margin: '10px auto', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
          />
          <button onClick={verifyOtp} style={{ display: 'block', margin: '10px auto', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Verify OTP</button>
          <button onClick={() => setStep('email')} style={{ display: 'block', margin: '10px auto', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Back</button>
        </div>
      )}
      <p style={{ textAlign: 'center', marginTop: '20px' }}><Link to="/admin-login" style={{ color: '#0078d7', textDecoration: 'none' }}>Admin Login</Link></p>
    </div>
  );
}

export default Login;