import React, { useEffect, useState, useContext } from 'react';
import axios from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('/exam/subjects');
        setSubjects(res.data);
      } catch (error) {
        alert('Error fetching subjects');
      }
    };
    fetchSubjects();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="subjects" style={{ fontFamily: 'Times New Roman, serif', backgroundColor: '#ffffff', color: '#333333', padding: '20px', border: '1px solid #cccccc', maxWidth: '900px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline' }}>Subjects</h2>
      <p style={{ marginBottom: '20px' }}>Welcome, {user.email}</p>
      <button onClick={logout} style={{ display: 'block', margin: '10px 0', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
      <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
        {subjects.map(subject => (
          <li key={subject.id} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #dddddd', borderRadius: '4px' }}>
            <Link to={`/test/${subject.id}`} style={{ color: '#0078d7', textDecoration: 'none' }}>{subject.name}</Link>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '20px' }}>
        <Link to="/scores" style={{ display: 'block', margin: '5px 0', color: '#0078d7', textDecoration: 'none' }}>View Scores</Link>
        <Link to="/payment" style={{ display: 'block', margin: '5px 0', color: '#0078d7', textDecoration: 'none' }}>Purchase Access</Link>
      </div>
    </div>
  );
}

export default Subjects;