// script.js

/**
 * Main DOMContentLoaded listener
 */
document.addEventListener('DOMContentLoaded', () => {

    const bodyId = document.body.id;
    const token = localStorage.getItem('token');
    
    // --- Page Routing ---
    if (bodyId === 'login-page' || bodyId === 'register-page') {
        if (token) {
            window.location.href = 'dashboard.html';
        }
    }
    
    if (bodyId === 'register-page') {
        setupRegistrationForm();
    } else if (bodyId === 'login-page') {
        setupLoginForm();
    } else if (bodyId === 'dashboard-page') {
        if (!token) {
            alert('You must be logged in to view this page.');
            window.location.href = 'index.html';
        } else {
            setupDashboard();
        }
    }
});


/**
 * Sets up the event listener for the REGISTRATION form.
 * (This function is unchanged)
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

        if (!name || !email || !password || !college || !gender || !degree) {
            messageEl.textContent = 'Please fill out all fields.';
            messageEl.style.color = 'red';
            return;
        }

        try {
            const response = await fetch('https://edu2job-node-backend.onrender.com/register', {
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
 * (This function is unchanged)
 */
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const messageEl = document.getElementById('message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://edu2job-node-backend.onrender.com/login', {
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
 * (This function is unchanged)
 */
function setupDashboard() {
    const welcomeEl = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');
    
    // 1. Set welcome message (unchanged)
    const userName = localStorage.getItem('userName');
    if (userName) {
        welcomeEl.textContent = `Welcome, ${userName}!`;
    }

    // 2. Setup Logout Button (unchanged)
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    });
    
    // 3. Initialize TomSelect Tagging Inputs (unchanged)
    const skillOptions = [
        { value: 'A/B Testing', text: 'A/B Testing' }, { value: 'Accessibility', text: 'Accessibility' },
        { value: 'Adobe XD', text: 'Adobe XD' }, { value: 'After Effects', text: 'After Effects' },
        { value: 'Agile', text: 'Agile' }, { value: 'Analytics', text: 'Analytics' },
        { value: 'AWS', text: 'AWS' }, { value: 'Azure', text: 'Azure' },
        { value: 'Big Data', text: 'Big Data' }, { value: 'Bootstrap', text: 'Bootstrap' },
        { value: 'Branding', text: 'Branding' }, { value: 'Business Intelligence', text: 'Business Intelligence' },
        { value: 'C', text: 'C' }, { value: 'C++', text: 'C++' },
        { value: 'Canva', text: 'Canva' }, { value: 'Classroom Management', text: 'Classroom Management' },
        { value: 'Cloud Deployment', text: 'Cloud Deployment' }, { value: 'Cloud Security', text: 'Cloud Security' },
        { value: 'Communication', text: 'Communication' }, { value: 'Computer Vision', text: 'Computer Vision' },
        { value: 'Content Writing', text: 'Content Writing' }, { value: 'Copywriting', text: 'Copywriting' },
        { value: 'CorelDRAW', text: 'CorelDRAW' }, { value: 'Creativity', text: 'Creativity' },
        { value: 'Critical Thinking', text: 'Critical Thinking' }, { value: 'Cryptography', text: 'Cryptography' },
        { value: 'CSS', text: 'CSS' }, { value: 'Curriculum Development', text: 'Curriculum Development' },
        { value: 'Cyber Threat Analysis', text: 'Cyber Threat Analysis' }, { value: 'Data Analytics', text: 'Data Analytics' },
        { value: 'Data Cleaning', text: 'Data Cleaning' }, { value: 'Data Visualization', text: 'Data Visualization' },
        { value: 'Deep Learning', text: 'Deep Learning' }, { value: 'Design Thinking', text: 'Design Thinking' },
        { value: 'DevOps Tools', text: 'DevOps Tools' }, { value: 'Django', text: 'Django' },
        { value: 'Docker', text: 'Docker' }, { value: 'EDA', text: 'EDA' },
        { value: 'Educational Tools', text: 'Educational Tools' }, { value: 'Ethical Hacking', text: 'Ethical Hanking' },
        { value: 'Excel', text: 'Excel' }, { value: 'Express.js', text: 'Express.js' },
        { value: 'Feature Engineering', text: 'Feature Engineering' }, { value: 'Figma', text: 'Figma' },
        { value: 'Finance Modeling', text: 'Finance Modeling' }, { value: 'Firewalls', text: 'Firewalls' },
        { value: 'Git', text: 'Git' }, { value: 'Google Analytics', text: 'Google Analytics' },
        { value: 'Graphic Layout', text: 'Graphic Layout' }, { value: 'Hadoop', text: 'Hadoop' },
        { value: 'HTML', text: 'HTML' }, { value: 'Illustrator', text: 'Illustrator' },
        { value: 'InDesign', text: 'InDesign' }, { value: 'Java', text: 'Java' },
        { value: 'JavaScript', text: 'JavaScript' }, { value: 'JIRA', text: 'JIRA' },
        { value: 'Keras', text: 'Keras' }, { value: 'Kubernetes', text: 'Kubernetes' },
        { value: 'Linux', text: 'Linux' }, { value: 'Logo Design', text: 'Logo Design' },
        { value: 'Machine Learning', text: 'Machine Learning' }, { value: 'Market Analysis', text: 'Market Analysis' },
        { value: 'Marketing Strategy', text: 'Marketing Strategy' }, { value: 'Matplotlib', text: 'Matplotlib' },
        { value: 'Mentoring', text: 'Mentoring' }, { value: 'ML Ops', text: 'ML Ops' },
        { value: 'Model Deployment', text: 'Model Deployment' }, { value: 'MongoDB', text: 'MongoDB' },
        { value: 'Motion Graphics', text: 'Motion Graphics' }, { value: 'MySQL', text: 'MySQL' },
        { value: 'Neural Networks', text: 'Neural Networks' }, { value: 'Networking', text: 'Networking' },
        { value: 'NLP', text: 'NLP' }, { value: 'Node.js', text: 'Node.js' },
        { value: 'NumPy', text: 'NumPy' }, { value: 'Pandas', text: 'Pandas' },
        { value: 'Penetration Testing', text: 'Penetration Testing' }, { value: 'PHP', text: 'PHP' },
        { value: 'Photoshop', text: 'Photoshop' }, { value: 'Power BI', text: 'Power BI' },
        { value: 'Premiere Pro', text: 'Premiere Pro' }, { value: 'Presentation', text: 'Presentation' },
        { value: 'Problem Solving', text: 'Problem Solving' }, { value: 'Product Strategy', text: 'Product Strategy' },
        { value: 'Prototyping', text: 'Prototyping' }, { value: 'PyTorch', text: 'PyTorch' },
        { value: 'Python', text: 'Python' }, { value: 'R', text: 'R' },
        { value: 'React', text: 'React' }, { value: 'Reinforcement Learning', text: 'Reinforcement Learning' },
        { value: 'Research', text: 'Research' }, { value: 'REST API', text: 'REST API' },
        { value: 'Risk Assessment', text: 'Risk Assessment' }, { value: 'Roadmapping', text: 'Roadmapping' },
        { value: 'Scikit-learn', text: 'Scikit-learn' }, { value: 'SEO', text: 'SEO' },
        { value: 'SIEM Tools', text: 'SIEM Tools' }, { value: 'Social Media Marketing', text: 'Social Media Marketing' },
        { value: 'Spark', text: 'Spark' }, { value: 'Spring Boot', text: 'Spring Boot' },
        { value: 'SQL', text: 'SQL' }, { value: 'Statistics', text: 'Statistics' },
        { value: 'Subject Expertise', text: 'Subject Expertise' }, { value: 'Tableau', text: 'Tableau' },
        { value: 'Teaching', text: 'Teaching' }, { value: 'TensorFlow', text: 'TensorFlow' },
        { value: 'Terraform', text: 'Terraform' }, { value: 'Typography', text: 'Typography' },
        { value: 'UI Design', text: 'UI Design' }, { value: 'UI Flow', text: 'UI Flow' },
        { value: 'Usability Testing', text: 'Usability Testing' }, { value: 'User Journey', text: 'User Journey' },
        { value: 'User Research', text: 'User Research' }, { value: 'UX', text: 'UX' },
        { value: 'UX Research', text: 'UX Research' }, { value: 'UX Strategy', text: 'UX Strategy' },
        { value: 'Virtualization', text: 'Virtualization' }, { value: 'Visual Design', text: 'Visual Design' },
        { value: 'Vue.js', text: 'Vue.js' }, { value: 'Wireframing', text: 'Wireframing' },
        { value: 'WordPress', text: 'WordPress' }
    ];
      
      
    const certOptions = [
        { value: 'HackerRank SQL', text: 'HackerRank SQL' }, { value: 'Google Cloud Basics', text: 'Google Cloud Basics' },
        { value: 'NPTEL Python', text: 'NPTEL Python' }, { value: 'Coursera Web Dev', text: 'Coursera Web Dev' },
        { value: 'Udemy Java', text: 'Udemy Java' }, { value: 'Infosys Springboard', text: 'Infosys Springboard' },
        { value: 'Oracle Cloud Infrastructure', text: 'Oracle Cloud Infrastructure' }, { value: 'AWS Certified Solutions Architect', text: 'AWS Certified Solutions Architect' },
        { value: 'Google Data Analytics', text: 'Google Data Analytics' }, { value: 'Google Cloud Engineer', text: 'Google Cloud Engineer' },
        { value: 'AWS Cloud Practitioner', text: 'AWS Cloud Practitioner' }, { value: 'Microsoft Azure Fundamentals', text: 'Microsoft Azure Fundamentals' },
        { value: 'Coursera Data Analyst Certificate', text: 'Coursera Data Analyst Certificate' }, { value: 'IBM Data Science', text: 'IBM Data Science' },
        { value: 'LinkedIn Learning Cloud Course', text: 'LinkedIn Learning Cloud Course' }, { value: 'IBM Design Thinking', text: 'IBM Design Thinking' },
        { value: 'UI/UX Bootcamp by Udemy', text: 'UI/UX Bootcamp by Udemy' }, { value: 'Graphic Design Masterclass', text: 'Graphic Design Masterclass' },
        { value: 'Motion Design Certification', text: 'Motion Design Certification' }, { value: 'Google UX Design', text: 'Google UX Design' },
        { value: 'Coursera Graphic Design', text: 'Coursera Graphic Design' }, { value: 'Adobe Certified Expert', text: 'Adobe Certified Expert' },
        { value: 'Nielsen Norman UX Certificate', text: 'Nielsen Norman UX Certificate' }, { value: 'Coursera UX Fundamentals', text: 'Coursera UX Fundamentals' },
        { value: 'Canva Pro Certification', text: 'Canva Pro Certification' }, { value: 'CFA Level 1', text: 'CFA Level 1' },
        { value: 'None', text: 'None' }, { value: 'Financial Analyst Certification', text: 'Financial Analyst Certification' },
        { value: 'FRM', text: 'FRM' }, { value: 'CFA Level 2', text: 'CFA Level 2' },
        { value: 'Scrum Master', text: 'Scrum Master' }, { value: 'Google PM Certificate', text: 'Google PM Certificate' },
        { value: 'Product Management Certificate', text: 'Product Management Certificate' }, { value: 'Agile Certification', text: 'Agile Certification' },
        { value: 'Copywriting Certification', text: 'Copywriting Certification' }, { value: 'HubSpot Content Marketing', text: 'HubSpot Content Marketing' },
        { value: 'SEO Certification', text: 'SEO Certification' }, { value: 'Social Media Strategy', text: 'Social Media Strategy' },
        { value: 'Google Digital Marketing', text: 'Google Digital Marketing' }, { value: 'NET Qualification', text: 'NET Qualification' },
        { value: 'Coursera Teaching Skills', text: 'Coursera Teaching Skills' }, { value: 'Teaching Certification', text: 'Teaching Certification' },
        { value: 'Educational Technology', text: 'Educational Technology' }, { value: 'Research Methodology', text: 'Research Methodology' },
        { value: 'Academic Writing Certification', text: 'Academic Writing Certification' }, { value: 'Excel Certification', text: 'Excel Certification' },
        { value: 'Power BI Certification', text: 'Power BI Certification' }, { value: 'SQL Certification', text: 'SQL Certification' },
        { value: 'Tableau Certification', text: 'Tableau Certification' }, { value: 'Business Analytics Certification', text: 'Business Analytics Certification' },
        { value: 'CISSP', text: 'CISSP' }, { value: 'CEH (Certified Ethical Hacker)', text: 'CEH (Certified Ethical Hacker)' },
        { value: 'CCNA Security', text: 'CCNA Security' }, { value: 'Cybersecurity Fundamentals', text: 'Cybersecurity Fundamentals' },
        { value: 'ISO 27001 Certification', text: 'ISO 27001 Certification' }, { value: 'CompTIA Security+', text: 'CompTIA Security+' },
        { value: 'Udemy SEO Expert', text: 'Udemy SEO Expert' }, { value: 'Google Ads', text: 'Google Ads' },
        { value: 'Data Analytics Certificate', text: 'Data Analytics Certificate' }, { value: 'HubSpot Marketing', text: 'HubSpot Marketing' },
        { value: 'Meta Blueprint', text: 'Meta Blueprint' }, { value: 'Coursera Marketing', text: 'Coursera Marketing' },
        { value: 'Excel Advanced', text: 'Excel Advanced' }, { value: 'AWS ML Specialty', text: 'AWS ML Specialty' },
        { value: 'Deep Learning Specialization', text: 'Deep Learning Specialization' }, { value: 'TensorFlow Developer', text: 'TensorFlow Developer' },
        { value: 'Azure AI Engineer', text: 'Azure AI Engineer' }, { value: 'Coursera ML by Andrew Ng', text: 'Coursera ML by Andrew Ng' }
    ];
    
    new TomSelect('#skills', {
        plugins: ['remove_button'], options: skillOptions, create: true,
        delimiter: ',', persist: false, closeAfterSelect: true 
    });
    new TomSelect('#certifications', {
        plugins: ['remove_button'], options: certOptions, create: true,
        delimiter: ',', persist: false, closeAfterSelect: true 
    });
    
    // --------------------------------------------------

    // 4. Setup the predictor form logic (unchanged)
    const predictorForm = document.getElementById('predictor-form');
    const predictBtn = document.getElementById('predict-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const resultsSection = document.getElementById('results-section');
    const resultsList = document.getElementById('results-list');

    predictorForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        predictBtn.disabled = true;
        predictBtn.textContent = 'Analyzing...';
        resultsSection.classList.add('results-hidden');
        resultsList.innerHTML = ''; 
        loadingSpinner.classList.remove('spinner-hidden');

        const formData = {
            degree: document.getElementById('degree').value,
            major: document.getElementById('major').value,
            specialization: document.getElementById('specialization').value,
            cgpa: document.getElementById('cgpa').value,
            skills: document.getElementById('skills').value,
            certifications: document.getElementById('certifications').value,
            experience: document.getElementById('experience').value,
            industry: document.getElementById('industry').value,
        };
        
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('https://edu2job-node-backend.onrender.com/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Prediction failed');
            }

            const data = await response.json();
            
            // This part is unchanged, it just calls the new helper function
            displayPredictions(data.predictions);

        } catch (error) {
            console.error('Prediction error:', error);
            displayError(error.message);
        } finally {
            loadingSpinner.classList.add('spinner-hidden');
            resultsSection.classList.remove('results-hidden');
            predictBtn.disabled = false;
            predictBtn.textContent = 'Predict Again';
        }
    });
}

// --- HELPER FUNCTIONS ---

// *** THIS IS THE NEW, SIMPLIFIED FUNCTION ***
// It removes all percentage, color, and conditional text logic
function displayPredictions(predictions) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; // Clear previous results

    if (!predictions || predictions.length === 0) {
        displayError("Model did not return any predictions.");
        return;
    }
    
    // Loop through the list of predictions
    predictions.forEach((prediction, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        // --- NEW SIMPLIFIED LOGIC ---
        let description = `This role is a good fit based on your profile.`;
        let matchTextSpan = '';

        if (index === 0) {
            // Special text for the first result
            matchTextSpan = `<span style="color: #16a34a; font-weight: 700;">(Top Match)</span>`;
            description = `Based on your profile, this is the <strong>Top Recommended</strong> career path.`;
        } else {
            matchTextSpan = `<span style="color: #3b82f6; font-weight: 500;">(Alternative Match)</span>`;
            description = `This role is also a good alternative based on your skills and preferences.`;
        }
        // --- END OF NEW LOGIC ---

        card.innerHTML = `
            <h3>${prediction.role} ${matchTextSpan}</h3>
            <p class="description">${description}</p>
            <div class="tags">
                <span class="tag">AI Recommended</span>
            </div>
        `;
        resultsList.appendChild(card);
    });
}

// This function creates the red "error" card (unchanged)
function displayError(errorMessage) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = ''; 

    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.borderColor = '#ef4444'; // Red border
    
    card.innerHTML = `
        <h3>Prediction Failed</h3>
        <p class="description">Could not generate a prediction. Please try again.</p>
        <div class="tags">
            <span class="tag" style="background-color: #fee2e2; color: #b91c1c;">Error: ${errorMessage}</span>
        </div>
    `;
    resultsList.appendChild(card);
}