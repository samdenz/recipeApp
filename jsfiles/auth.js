// Utility functions
function showMessage(message) {
    alert(message);
}

// Registration Logic
function registerUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("e-mail").value;
    const dateOfBirth = document.getElementById("dateOfBirth").value;
    const password = document.getElementById("password").value;

    if (!username || !email || !dateOfBirth || !password) {
        showMessage("Please fill in all fields.");
        return;
    }

    // Save user data in localStorage (simple simulation; replace with backend integration for production)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        showMessage("A user with this email already exists.");
    } else {
        users.push({ username, email, dateOfBirth, password });
        localStorage.setItem("users", JSON.stringify(users));
        showMessage("Registration successful! You can now log in.");
        window.location.href = "/front-end/loginPage.html";
    }
}

// Login Logic
function loginUser() {
    const email = document.getElementById("e-mail").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showMessage("Please enter your email and password.");
        return;
    }

    // Retrieve user data from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        showMessage(`Welcome back, ${user.username}!`);
        // Redirect to a dashboard or home page
        window.location.href = "/front-end/HomePage.html";
    } else {
        showMessage("Invalid email or password. Please try again.");
    }
    
}

// Attach event listeners to buttons
document.addEventListener("DOMContentLoaded", () => {
    const registerButton = document.querySelector("button[type='submit'][onclick*='register']");
    const loginButton = document.querySelector("button[type='submit'][onclick*='login']");

    if (registerButton) {
        registerButton.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent form submission
            registerUser();
        });
    }

    if (loginButton) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent form submission
            loginUser();
        });
    }
});


