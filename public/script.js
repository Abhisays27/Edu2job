// script.js

/**
 * Add a "DOMContentLoaded" event listener.
 * This ensures our code only runs after the HTML document is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {

    const bodyId = document.body.id;
    const token = localStorage.getItem('token');
    
    // --- Page Routing ---
    // Check which page we're on and run the appropriate setup function.
    
    if (bodyId === 'login-page' || bodyId === 'register-page') {
        // If user is already logged in, redirect them to the dashboard
        if (token) {
            window.location.href = 'dashboard.html';
        }
    }
    
    if (bodyId === 'register-page') {
        setupRegistrationForm();
    } else if (bodyId === 'login-page') {
        setupLoginForm();
    } else if (bodyId === 'dashboard-page') {
        // This is a protected page
        if (!token) {
            // If no token, redirect to login
            window.location.href = 'index.html';
        } else {
            // If token exists, setup the dashboard
            setupDashboard();
        }
    }
});

/**
 * Sets up the event listener for the registration form.
 */
function setupRegistrationForm() {
    const registerForm = document.getElementById('register-form');
    const messageEl = document.getElementById('message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) { // Status 200-299
                messageEl.textContent = 'Registration successful! Redirecting to login...';
                messageEl.style.color = 'green';
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                // Show error message from server (e.g., "Email already in use")
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
 * Sets up the event listener for the login form.
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const messageEl = document.getElementById('message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                // Store the token and user's name in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userName', data.name);
                
                // Redirect to the dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Show error message (e.g., "Invalid credentials")
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
 * Sets up the dashboard page: welcome message, logout button, and fetches data.
 */
function setupDashboard() {
    const welcomeEl = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');
    
    // 1. Set welcome message from localStorage
    const userName = localStorage.getItem('userName');
    if (userName) {
        welcomeEl.textContent = `Welcome, ${userName}!`;
    }

    // 2. Setup Logout Button
    logoutButton.addEventListener('click', () => {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        
        // Redirect to login page
        window.location.href = 'index.html';
    });

    // 3. Fetch protected data from the server
    fetchDashboardData();
}

/**
 * Fetches protected data and populates the dashboard.
 */
async function fetchDashboardData() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/api/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // Send the JWT
            }
        });

        if (response.status === 401 || response.status === 403) {
            // Token is invalid or expired
            alert('Session expired. Please log in again.');
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        
        // Populate the table with dummy job data
        populateJobTable(data.jobs);

        // Render the chart with dummy chart data
        renderJobChart(data.chart);

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Could not load dashboard data.');
    }
}

/**
 * Populates the job table with data from the server.
 * @param {Array} jobs - An array of job objects
 */
function populateJobTable(jobs) {
    const tableBody = document.getElementById('job-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    jobs.forEach(job => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${job.role}</td>
            <td>${job.company}</td>
            <td>${job.skills}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Renders the Chart.js bar chart.
 * @param {Object} chartData - An object with 'labels' and 'counts' arrays
 */
function renderJobChart(chartData) {
    const ctx = document.getElementById('jobChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar', // Type of chart
        data: {
            labels: chartData.labels, // X-axis labels (e.g., 'B.Tech CSE')
            datasets: [{
                label: '# of Graduates in Roles',
                data: chartData.counts, // Y-axis data (e.g., 120)
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            responsive: true,
            maintainAspectRatio: true
        }
    });
}