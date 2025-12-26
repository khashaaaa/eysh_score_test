import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Admin() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [bulkQuestions, setBulkQuestions] = useState('');
  const [selectedSubjectForBulk, setSelectedSubjectForBulk] = useState('');
  const [durations, setDurations] = useState({});
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.is_admin) {
      navigate('/login');
      return;
    }
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('/admin/subjects');
        setSubjects(res.data);
        const dur = {};
        res.data.forEach(sub => dur[sub.id] = sub.duration || 3600);
        setDurations(dur);
      } catch (error) {
        alert('Error fetching subjects');
      }
    };
    fetchSubjects();
  }, [user, navigate]);

  const addSubject = async () => {
    try {
      await axios.post('/admin/subjects', { name: newSubject });
      alert('Subject added');
      setNewSubject('');
      const res = await axios.get('/admin/subjects');
      setSubjects(res.data);
    } catch (error) {
      alert('Error adding subject');
    }
  };

  const addQuestion = async () => {
    try {
      await axios.post('/admin/questions', {
        subjectId,
        question,
        options,
        correctAnswer
      });
      alert('Question added');
      setQuestion('');
      setOptions(['', '', '', '']);
      setCorrectAnswer('');
    } catch (error) {
      alert('Error adding question');
    }
  };

  const addBulkQuestions = async () => {
    const lines = bulkQuestions.split('\n').map(line => line.trim()).filter(line => line);
    const questions = [];
    let currentQuestion = null;

    for (const line of lines) {
      if (line.endsWith('?')) {
        if (currentQuestion) questions.push(currentQuestion);
        currentQuestion = { question: line, options: [], correctAnswer: '' };
      } else if (line.startsWith('Correct:')) {
        if (currentQuestion) currentQuestion.correctAnswer = line.replace('Correct:', '').trim();
      } else if (currentQuestion && currentQuestion.options.length < 4) {
        currentQuestion.options.push(line);
      }
    }
    if (currentQuestion) questions.push(currentQuestion);

    for (const q of questions) {
      try {
        await axios.post('/admin/questions', {
          subjectId: selectedSubjectForBulk,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        });
      } catch (error) {
        alert(`Error adding question: ${q.question}`);
      }
    }
    alert('Bulk questions added');
    setBulkQuestions('');
  };

  const updateDuration = async (subjectId, duration) => {
    try {
      await axios.put(`/admin/subjects/${subjectId}/duration`, { duration });
      setDurations({ ...durations, [subjectId]: duration });
      alert('Duration updated');
    } catch (error) {
      alert('Error updating duration');
    }
  };

  if (!user || !user.is_admin) return null;

  return (
    <div className="admin" style={{ fontFamily: 'Times New Roman, serif', backgroundColor: '#ffffff', color: '#333333', padding: '20px', border: '1px solid #cccccc', maxWidth: '900px', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <button onClick={logout} style={{ display: 'block', margin: '10px 0', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
      <Link to="/" style={{ display: 'block', margin: '10px 0', color: '#0078d7', textDecoration: 'none' }}>Back to Subjects</Link>
      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline' }}>Add Subject</h2>
      <input
        type="text"
        placeholder="Subject Name"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
        style={{ display: 'block', margin: '10px 0', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
      />
      <button onClick={addSubject} style={{ display: 'block', margin: '10px 0', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Add Subject</button>

      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline' }}>Set Exam Durations</h2>
      {subjects.map(sub => (
        <div key={sub.id} style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #dddddd', borderRadius: '4px' }}>
          <label style={{ marginRight: '10px' }}>{sub.name}: </label>
          <input
            type="number"
            value={durations[sub.id] || 3600}
            onChange={(e) => setDurations({ ...durations, [sub.id]: parseInt(e.target.value) })}
            style={{ padding: '5px', border: '2px solid #aaaaaa', borderRadius: '4px', marginRight: '10px' }}
          />
          <span> seconds</span>
          <button onClick={() => updateDuration(sub.id, durations[sub.id])} style={{ padding: '5px 10px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Update</button>
        </div>
      ))}

      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline' }}>Add Question</h2>
      <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} style={{ display: 'block', margin: '10px 0', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}>
        <option value="">Select Subject</option>
        {subjects.map(sub => (
          <option key={sub.id} value={sub.id}>{sub.name}</option>
        ))}
      </select>
      <textarea
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ display: 'block', margin: '10px 0', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px', height: '80px' }}
      />
      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Option ${i+1}`}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[i] = e.target.value;
            setOptions(newOpts);
          }}
          style={{ display: 'block', margin: '10px 0', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
        />
      ))}
      <input
        type="text"
        placeholder="Correct Answer"
        value={correctAnswer}
        onChange={(e) => setCorrectAnswer(e.target.value)}
        style={{ display: 'block', margin: '10px 0', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}
      />
      <button onClick={addQuestion} style={{ display: 'block', margin: '10px 0', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Add Question</button>

      <h2 style={{ fontWeight: 'bold', color: '#222222', marginBottom: '20px', textDecoration: 'underline' }}>Bulk Add Questions</h2>
      <select value={selectedSubjectForBulk} onChange={(e) => setSelectedSubjectForBulk(e.target.value)} style={{ display: 'block', margin: '10px 0', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '300px' }}>
        <option value="">Select Subject</option>
        {subjects.map(sub => (
          <option key={sub.id} value={sub.id}>{sub.name}</option>
        ))}
      </select>
      <textarea
        placeholder="Paste questions in format:&#10;Question?&#10;Option1&#10;Option2&#10;Option3&#10;Option4&#10;Correct: Option1&#10;&#10;Next Question..."
        value={bulkQuestions}
        onChange={(e) => setBulkQuestions(e.target.value)}
        rows="20"
        style={{ display: 'block', margin: '10px 0', padding: '10px', border: '2px solid #aaaaaa', borderRadius: '4px', width: '100%', maxWidth: '500px' }}
      />
      <button onClick={addBulkQuestions} style={{ display: 'block', margin: '10px 0', padding: '10px 15px', backgroundColor: '#dddddd', color: '#333333', border: '2px solid #aaaaaa', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Add Bulk Questions</button>
    </div>
  );
}

export default Admin;