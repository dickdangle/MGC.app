// User data management
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Function to signup a new user
function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    
    if (username && password) {
        const userExists = users.some(user => user.username === username);
        
        if (!userExists) {
            users.push({ username, password, points: 100 }); // Initial points
            localStorage.setItem('users', JSON.stringify(users));
            alert('Signup successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert('Username already exists. Please choose another one.');
        }
    } else {
        alert('Please enter both username and password.');
    }
}

// Function to login a user
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        window.location.href = 'app.html';
    } else {
        alert('Invalid username or password.');
    }
}

// Function to logout a user
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Function to display current user points
function displayUserPoints() {
    const userPointsElement = document.getElementById('user-points');
    if (currentUser) {
        userPointsElement.innerHTML = `Current User Points: ${currentUser.points}`;
    } else {
        userPointsElement.innerHTML = 'No user logged in.';
    }
}

// Call displayUserPoints on page load if element exists
if (document.getElementById('user-points')) {
    displayUserPoints();
}
