<<<<<<< HEAD
// Initialize users from local storage or as an empty array
let users = JSON.parse(localStorage.getItem('users')) || [];

// Function to sign up a new user
function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        users.push({ username, password, points: 0 });
        localStorage.setItem('users', JSON.stringify(users));
        window.location.href = 'login.html';
    } else {
        alert('Please fill out both fields.');
    }
}

// Function to log in a user
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'app.html';
    } else {
        alert('Invalid username or password.');
    }
}
=======
// Initialize users from local storage or as an empty array
let users = JSON.parse(localStorage.getItem('users')) || [];

// Function to sign up a new user
function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    if (username && password) {
        users.push({ username, password, points: 0 });
        localStorage.setItem('users', JSON.stringify(users));
        window.location.href = 'login.html';
    } else {
        alert('Please fill out both fields.');
    }
}

// Function to log in a user
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'app.html';
    } else {
        alert('Invalid username or password.');
    }
}
>>>>>>> e9eaefd1058ad34c134c7c05aafe49409b816cd7
