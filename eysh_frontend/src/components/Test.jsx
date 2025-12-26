import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useParams, useNavigate } from 'react-router-dom';

function Test() {
  const { subjectId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // default, will be updated
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`/exam/questions/${subjectId}`);
        setQuestions(res.data.questions);
        setTimeLeft(res.data.duration);
      } catch (error) {
        alert('Error fetching questions');
      }
    };
    fetchQuestions();
  }, [subjectId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto-submit when time runs out
      const autoSubmit = async () => {
        try {
          await axios.post(`/exam/submit/${subjectId}`, { answers });
          navigate('/scores');
        } catch (error) {
          alert('Error submitting test');
        }
      };
      autoSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, subjectId, answers, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`/exam/submit/${subjectId}`, { answers });
      navigate('/scores');
    } catch (error) {
      alert('Error submitting test');
    }
  };

  return (
    <div className="test" style={{ fontFamily: 'Times New Roman, serif', backgroundColor: '#ffffff', color: '#333333', padding: '20px', border: '1px solid #cccccc', maxWidth: '900px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline' }}>Test</h2>
      <div className="timer" style={{ textAlign: 'center', marginBottom: '20px' }}>Time remaining: {formatTime(timeLeft)}</div>
      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #dddddd', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 10px 0' }}>{q.question}</p>
          {q.options.map((opt, i) => (
            <label key={i} style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                style={{ marginRight: '10px' }}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} style={{ display: 'block', margin: '20px auto', padding: '12px 16px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Submit</button>
    </div>
  );
}

export default Test;