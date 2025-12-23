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
    <div className="scores">
      <h2>Your Scores</h2>
      {profile && (
        <div className="profile">
          <h3>Profile</h3>
          <p>Email: {profile.email}</p>
          {profile.phone_number && <p>Phone: {profile.phone_number}</p>}
          <p>Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      )}
      <Bar data={data} />
      <h3>Score Details</h3>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Rank</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={i}>
              <td>{s.name}</td>
              <td>{s.score}/{s.total}</td>
              <td>{((s.score / s.total) * 100).toFixed(1)}%</td>
              <td>{s.rank}</td>
              <td>{new Date(s.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Scores;