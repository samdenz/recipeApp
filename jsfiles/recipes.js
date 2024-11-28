const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors'); // Allow cross-origin requests

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable cross-origin resource sharing

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recipeapp',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

// API Endpoints

// Add a food recipe
app.post('/api/recipes', (req, res) => {
  const { recipename, ingredients, instructions, image, serving, preptime, cooktime } = req.body;
  const query = `
    INSERT INTO recipes (recipename, ingredients, instructions, image, serving, preptime, cooktime)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [recipename, ingredients, instructions, image, serving, preptime, cooktime], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error saving food recipe.' });
    }
    res.status(201).json({ message: 'Food recipe added successfully.' });
  });
});

// Add a drink recipe
app.post('/api/drinks', (req, res) => {
  const { drinkname, ingredients, instructions, image, serving } = req.body;
  const query = `
    INSERT INTO drinks (drinkname, ingredients, instructions, image, serving)
    VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [drinkname, ingredients, instructions, image, serving], (err) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error saving drink recipe.' });
    }
    res.status(201).json({ message: 'Drink recipe added successfully.' });
  });
});

// Get all recipes
app.get('/api/recipes', (req, res) => {
  const foodQuery = 'SELECT * FROM recipes';
  const drinkQuery = 'SELECT * FROM drinks';

  db.query(foodQuery, (err, foodResults) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error fetching food recipes.' });
    }
    db.query(drinkQuery, (err, drinkResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Error fetching drink recipes.' });
      }
      res.json({ foodRecipes: foodResults, drinkRecipes: drinkResults });
    });
  });
});

// Delete a food recipe by ID
app.delete('/api/food-recipes/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM recipes WHERE id = ?`;
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Error deleting food recipe.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Food recipe not found.' });
      }
      res.json({ message: 'Food recipe deleted successfully.' });
    });
  });
  
  // Delete a drink recipe by ID
  app.delete('/api/drink-recipes/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM drinks WHERE id = ?`;
  
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Error deleting drink recipe.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Drink recipe not found.' });
      }
      res.json({ message: 'Drink recipe deleted successfully.' });
    });
  });

  //front end for displaying data
const API_URL = 'http://localhost:3000/api/recipes';

async function fetchRecipes() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.statusText}`);
    }
    const { foodRecipes, drinkRecipes } = await response.json();

    const container = document.getElementById('food-recipes-container');
    container.innerHTML = '';

    // Display Food Recipes
    const foodSection = document.createElement('section');
    foodSection.innerHTML = '<h2>Food Recipes</h2>';
    foodRecipes.forEach(recipe => {
      foodSection.innerHTML += `
        <div class="recipe">
          <h3>${recipe.recipename}</h3>
          <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
          <p><strong>Instructions:</strong> ${recipe.instructions}</p>
          <img src="${recipe.image}" alt="${recipe.recipename}" width="200" />
          <p><strong>Serving:</strong> ${recipe.serving}</p>
          <p><strong>Prep Time:</strong> ${recipe.preptime} mins</p>
          <p><strong>Cook Time:</strong> ${recipe.cooktime} mins</p>
        </div>`;
    });
    container.appendChild(foodSection);

    // Display Drink Recipes
    const drinkSection = document.createElement('section');
    drinkSection.innerHTML = '<h2>Drink Recipes</h2>';
    drinkRecipes.forEach(recipe => {
      drinkSection.innerHTML += `
        <div class="recipe">
          <h3>${recipe.drinkname}</h3>
          <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
          <p><strong>Instructions:</strong> ${recipe.instructions}</p>
          <img src="${recipe.image}" alt="${recipe.drinkname}" width="200" />
          <p><strong>Serving:</strong> ${recipe.serving}</p>
        </div>`;
    });
    container.appendChild(drinkSection);
  } catch (error) {
    console.error('Error:', error);
    const container = document.getElementById('drink-recipes-container');
    container.innerHTML = `<p>Error loading recipes: ${error.message}</p>`;
  }
}

// Fetch recipes when the page loads
fetchRecipes();

  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
