// script.js

/**
 * Main DOMContentLoaded listener
 * This runs when the page is loaded and routes to the correct setup function.
 */
document.addEventListener('DOMContentLoaded', () => {

    const bodyId = document.body.id;
    const token = localStorage.getItem('token');
    
    // --- Page Routing ---
    
    // If on login/register page but already logged in, redirect to dashboard
    if (bodyId === 'login-page' || bodyId === 'register-page') {
        if (token) {
            window.location.href = 'dashboard.html';
        }
    }
    
    // Run setup function based on which page we're on
    if (bodyId === 'register-page') {
        setupRegistrationForm();
    } else if (bodyId === 'login-page') {
        setupLoginForm();
    } else if (bodyId === 'dashboard-page') {
        // This is a protected page
        if (!token) {
            // If no token, redirect to login
            alert('You must be logged in to view this page.');
            window.location.href = 'index.html';
        } else {
            // If token exists, setup the dashboard
            setupDashboard();
        }
    }
});


/**
 * Sets up the event listener for the REGISTRATION form.
 * (This function is UNCHANGED)
 */
function setupRegistrationForm() {
    const registerForm = document.getElementById('register-form');
    const messageEl = document.getElementById('message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const college = document.getElementById('college').value;
        const gender = document.getElementById('gender').value;
        const degree = document.getElementById('degree').value;

        if (!gender || !degree) {
            messageEl.textContent = 'Please select your gender and degree.';
            messageEl.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, college, gender, degree })
            });

            const data = await response.json();

            if (response.ok) {
                messageEl.textContent = 'Registration successful! Redirecting to login...';
                messageEl.style.color = 'green';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                messageEl.textContent = data.message;
                messageEl.style.color = 'red';
            }
        } catch (error) {
            console.error('Registration error:', error);
            messageEl.textContent = 'An error occurred. Please try again.';
            messageEl.style.color = 'red';
        }
    });
}


/**
 * Sets up the event listener for the LOGIN form.
 * (This function is UNCHANGED)
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const messageEl = document.getElementById('message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                window.location.href = 'dashboard.html';
            } else {
                messageEl.textContent = data.message;
                messageEl.style.color = 'red';
            }
        } catch (error) {
            console.error('Login error:', error);
            messageEl.textContent = 'An error occurred. Please try again.';
            messageEl.style.color = 'red';
        }
    });
}


/**
 * Sets up the NEW DASHBOARD page.
 * (This function is MODIFIED)
 */
function setupDashboard() {
    const welcomeEl = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');
    
    // 1. Set welcome message
    const userName = localStorage.getItem('userName');
    if (userName) {
        welcomeEl.textContent = `Welcome, ${userName}!`;
    }

    // 2. Setup Logout Button
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    });

    // 3. Setup the new predictor form logic
    const predictorForm = document.getElementById('predictor-form');
    const predictBtn = document.getElementById('predict-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsSection = document.getElementById('results-section');

    predictorForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page refresh

        // Start loading state
        predictBtn.disabled = true;
        predictBtn.textContent = 'Analyzing...';
        resultsSection.classList.add('results-hidden');
        loadingSpinner.classList.remove('spinner-hidden');

        // Simulate a 2-second analysis
        setTimeout(() => {
            // Stop loading state
            loadingSpinner.classList.add('spinner-hidden');
            resultsSection.classList.remove('results-hidden');

            // Reset button
            predictBtn.disabled = false;
            predictBtn.textContent = 'Predict Again';

        }, 2000); // 2-second delay
    });
}

