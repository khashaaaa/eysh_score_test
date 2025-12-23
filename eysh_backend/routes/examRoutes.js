const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get subjects
router.get('/subjects', authenticateToken, async (req, res) => {
  try {
    const subjects = await pool.query('SELECT * FROM subjects');
    res.json(subjects.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get questions for a subject
router.get('/questions/:subjectId', authenticateToken, async (req, res) => {
  const { subjectId } = req.params;
  try {
    const questions = await pool.query('SELECT * FROM questions WHERE subject_id = $1', [subjectId]);
    const subject = await pool.query('SELECT duration FROM subjects WHERE id = $1', [subjectId]);
    res.json({ questions: questions.rows, duration: subject.rows[0]?.duration || 3600 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit answers
router.post('/submit/:subjectId', authenticateToken, async (req, res) => {
  const { subjectId } = req.params;
  const { answers } = req.body;
  const userId = req.user.id;

  try {
    let score = 0;
    const total = Object.keys(answers).length;

    for (const [questionId, answer] of Object.entries(answers)) {
      const correct = await pool.query('SELECT correct_answer FROM questions WHERE id = $1', [questionId]);
      if (correct.rows[0] && correct.rows[0].correct_answer === answer) score++;
    }

    // Save score
    await pool.query('INSERT INTO scores (user_id, subject_id, score, total) VALUES ($1, $2, $3, $4)', [userId, subjectId, score, total]);

    res.json({ score, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's scores with rankings
router.get('/scores', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const scores = await pool.query(`
      SELECT s.*, sub.name, 
             RANK() OVER (PARTITION BY s.subject_id ORDER BY (s.score::float / s.total) DESC) as rank
      FROM scores s
      JOIN subjects sub ON s.subject_id = sub.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
    `, [userId]);
    res.json(scores.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;