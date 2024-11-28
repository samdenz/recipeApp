const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recipeapp', // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

// API: Fetch Food Recipes
app.get('/api/food-recipes', (req, res) => {
  const query = 'SELECT * FROM recipes';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error fetching food recipes.' });
    }
    res.json(results);
  });
});

// API: Fetch Drink Recipes
app.get('/api/drink-recipes', (req, res) => {
  const query = 'SELECT * FROM drinks';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error fetching drink recipes.' });
    }
    res.json(results);
  });
});

app.post('/api/food-recipes', (req, res) => {
  const { recipename, ingredients, instructions, image, serving, preptime, cooktime } = req.body;

  if (!recipename || !ingredients || !instructions || !serving || !preptime || !cooktime) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = `
    INSERT INTO recipes (recipename, ingredients, instructions, image, serving, preptime, cooktime)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [recipename, ingredients, instructions, image, serving, preptime, cooktime], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add recipe.' });
    }
    res.status(201).json({ message: 'Recipe added successfully.' });
  });
});

app.delete('/api/food-recipes/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM recipes WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to delete recipe.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Recipe not found.' });
    }

    res.json({ message: 'Recipe deleted successfully.' });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
