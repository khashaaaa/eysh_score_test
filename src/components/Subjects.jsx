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
    <div className="subjects">
      <h2>Subjects</h2>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>
      <ul>
        {subjects.map(subject => (
          <li key={subject.id}>
            <Link to={`/test/${subject.id}`}>{subject.name}</Link>
          </li>
        ))}
      </ul>
      <Link to="/scores">View Scores</Link>
      <Link to="/payment">Purchase Access</Link>
      {user.is_admin && <Link to="/admin">Admin Panel</Link>}
    </div>
  );
}

export default Subjects;