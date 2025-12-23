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
    <div className="test">
      <h2>Test</h2>
      <div className="timer">Time remaining: {formatTime(timeLeft)}</div>
      {questions.map(q => (
        <div key={q.id}>
          <p>{q.question}</p>
          {q.options.map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Test;