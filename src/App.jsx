import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import Subjects from './components/Subjects';
import Test from './components/Test';
import Scores from './components/Scores';
import Payment from './components/Payment';
import Admin from './components/Admin';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/" element={<Subjects />} />
            <Route path="/test/:subjectId" element={<Test />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;