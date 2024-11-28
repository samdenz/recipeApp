// Utility functions
function showMessage(message) {
  alert(message);
}

// Register User
function registerUser() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("e-mail").value;
  const dateOfBirth = document.getElementById("dateOfBirth").value;
  const password = document.getElementById("password").value;

  if (!username || !email || !dateOfBirth || !password) {
    showMessage("Please fill in all fields.");
    return;
  }

  fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, dateOfBirth, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showMessage("Registration successful! You can now log in.");
        window.location.href = "/front-end/loginPage.html";
      } else {
        showMessage(data.error || "An error occurred.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage("An error occurred during registration.");
    });
}

// Login User
function loginUser() {
  const email = document.getElementById("e-mail").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("Please fill in all fields.");
    return;
  }

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showMessage(`Welcome back!`);
        window.location.href = "/front-end/HomePage.html"; // Redirect to a dashboard or home page
      } else {
        showMessage(data.error || "An error occurred.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage("An error occurred during login.");
    });
}

// Fetch Recipes
async function fetchRecipes() {
  const foodContainer = document.getElementById('food-recipes-container');
  const drinkContainer = document.getElementById('drink-recipes-container');
  const container = foodContainer || drinkContainer;

  if (!container) {
    console.error('No container found for recipes.');
    return;
  }

  const API_URL = foodContainer
    ? 'http://localhost:3000/api/food-recipes'
    : 'http://localhost:3000/api/drink-recipes';

  container.innerHTML = '<p>Loading recipes...</p>';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Failed to fetch recipes: ${response.statusText}`);

    const recipes = await response.json();
    container.innerHTML = ''; // Clear loading message

    recipes.forEach(recipe => {
      const recipeDiv = document.createElement('div');
      recipeDiv.className = 'recipe';
      recipeDiv.innerHTML = `
        <h3>${recipe.recipename || recipe.drinkname}</h3>
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <img src="${recipe.image}" alt="${recipe.recipename || recipe.drinkname}" width="200" />
        <p><strong>Serving:</strong> ${recipe.serving}</p>
        ${recipe.preptime ? `<p><strong>Prep Time:</strong> ${recipe.preptime} mins</p>` : ''}
        ${recipe.cooktime ? `<p><strong>Cook Time:</strong> ${recipe.cooktime} mins</p>` : ''}
      `;
      container.appendChild(recipeDiv);
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    container.innerHTML = `<p>Error loading recipes: ${error.message}</p>`;
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Attach register event
  const registerButton = document.querySelector("button[type='submit'][onclick*='register']");
  if (registerButton) {
    registerButton.addEventListener("click", (e) => {
      e.preventDefault();
      registerUser();
    });
  }

  // Attach login event
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      loginUser();
    });
  }

  // Fetch recipes if container is present
  fetchRecipes();
});

// Upload Food Recipe
async function uploadFoodRecipe(data) {
  try {
    const response = await fetch('http://localhost:3000/api/food-recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message || 'Recipe added successfully!');
    } else {
      alert(result.error || 'Failed to add recipe.');
    }
  } catch (error) {
    console.error('Error uploading recipe:', error);
    alert('An error occurred while uploading the recipe.');
  }
}

// Delete Food Recipe
async function deleteFoodRecipe(recipeId) {
  try {
    const response = await fetch(`http://localhost:3000/api/food-recipes/${recipeId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message || 'Recipe deleted successfully!');
    } else {
      alert(result.error || 'Failed to delete recipe.');
    }
  } catch (error) {
    console.error('Error deleting recipe:', error);
    alert('An error occurred while deleting the recipe.');
  }
}

// Upload Drink Recipe
async function uploadDrinkRecipe(data) {
  try {
    const response = await fetch('http://localhost:3000/api/drink-recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message || 'Drink recipe added successfully!');
    } else {
      alert(result.error || 'Failed to add drink recipe.');
    }
  } catch (error) {
    console.error('Error uploading drink recipe:', error);
    alert('An error occurred while uploading the drink recipe.');
  }
}

// Delete Drink Recipe
async function deleteDrinkRecipe(recipeId) {
  try {
    const response = await fetch(`http://localhost:3000/api/drink-recipes/${recipeId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message || 'Drink recipe deleted successfully!');
    } else {
      alert(result.error || 'Failed to delete drink recipe.');
    }
  } catch (error) {
    console.error('Error deleting drink recipe:', error);
    alert('An error occurred while deleting the drink recipe.');
  }
}

