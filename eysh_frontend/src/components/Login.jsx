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
    <div className="login">
      <h2>User Login</h2>
      {step === 'email' ? (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
          <button onClick={() => setStep('email')}>Back</button>
        </div>
      )}
      <p><Link to="/admin-login">Admin Login</Link></p>
    </div>
  );
}

export default Login;