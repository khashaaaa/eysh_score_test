import React, { useEffect, useState, useContext } from 'react';
import axios from '../utils/axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AuthContext } from '../contexts/AuthContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Scores() {
  const [scores, setScores] = useState([]);
  const [profile, setProfile] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scoresRes, profileRes] = await Promise.all([
          axios.get('/exam/scores'),
          axios.get('/auth/profile')
        ]);
        setScores(scoresRes.data);
        setProfile(profileRes.data);
      } catch (error) {
        alert('Error fetching data');
      }
    };
    if (user) fetchData();
  }, [user]);

  const data = {
    labels: scores.map(s => `${s.name} (${new Date(s.created_at).toLocaleDateString()})`),
    datasets: [{
      label: 'Scores',
      data: scores.map(s => (s.score / s.total) * 100),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  return (
    <div className="scores" style={{ fontFamily: 'Times New Roman, serif', backgroundColor: '#ffffff', color: '#333333', padding: '20px', border: '1px solid #cccccc', maxWidth: '900px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline' }}>Your Scores</h2>
      {profile && (
        <div className="profile" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #dddddd', borderRadius: '4px' }}>
          <h3 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '10px', textDecoration: 'underline' }}>Profile</h3>
          <p style={{ margin: '5px 0' }}>Email: {profile.email}</p>
          {profile.phone_number && <p style={{ margin: '5px 0' }}>Phone: {profile.phone_number}</p>}
          <p style={{ margin: '5px 0' }}>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      )}
      <div style={{ marginBottom: '20px' }}><Bar data={data} /></div>
      <h3 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '10px', textDecoration: 'underline' }}>Score Details</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #dddddd', backgroundColor: '#f9f9f9', textAlign: 'left' }}>Subject</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd', backgroundColor: '#f9f9f9', textAlign: 'left' }}>Score</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd', backgroundColor: '#f9f9f9', textAlign: 'left' }}>Percentage</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd', backgroundColor: '#f9f9f9', textAlign: 'left' }}>Rank</th>
            <th style={{ padding: '10px', border: '1px solid #dddddd', backgroundColor: '#f9f9f9', textAlign: 'left' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={i}>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{s.name}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{s.score}/{s.total}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{((s.score / s.total) * 100).toFixed(1)}%</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{s.rank}</td>
              <td style={{ padding: '10px', border: '1px solid #dddddd' }}>{new Date(s.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Scores;