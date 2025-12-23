const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Add subject
router.post('/subjects', authenticateToken, requireAdmin, async (req, res) => {
  const { name, duration = 3600 } = req.body;

  try {
    await pool.query('INSERT INTO subjects (name, duration) VALUES ($1, $2)', [name, duration]);
    res.json({ message: 'Subject added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subjects
router.get('/subjects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const subjects = await pool.query('SELECT * FROM subjects');
    res.json(subjects.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add question
router.post('/questions', authenticateToken, requireAdmin, async (req, res) => {
  const { subjectId, question, options, correctAnswer } = req.body;

  try {
    await pool.query('INSERT INTO questions (subject_id, question, options, correct_answer) VALUES ($1, $2, $3, $4)', [subjectId, question, JSON.stringify(options), correctAnswer]);
    res.json({ message: 'Question added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all questions
router.get('/questions', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const questions = await pool.query('SELECT * FROM questions');
    res.json(questions.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subject duration
router.put('/subjects/:id/duration', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { duration } = req.body;

  try {
    await pool.query('UPDATE subjects SET duration = $1 WHERE id = $2', [duration, id]);
    res.json({ message: 'Duration updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;