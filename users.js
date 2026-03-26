(function () {
  'use strict';

  const USERS_KEY = 'users';
  const CURRENT_USER_KEY = 'currentUser';

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function readUsers() {
    const users = readJson(USERS_KEY, []);
    return Array.isArray(users) ? users : [];
  }

  function currentUser() {
    return readJson(CURRENT_USER_KEY, null);
  }

  function setCurrentUser(user) {
    if (user) {
      writeJson(CURRENT_USER_KEY, user);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  function displayUserPoints() {
    const userPointsElement = document.getElementById('user-points');
    if (!userPointsElement) {
      return;
    }

    const user = currentUser();
    userPointsElement.textContent = user
      ? `Current User Points: ${user.points}`
      : 'No user logged in.';
  }

  function signup() {
    const username = document.getElementById('signup-username')?.value.trim();
    const password = document.getElementById('signup-password')?.value;
    const users = readUsers();

    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    if (users.some((user) => user.username === username)) {
      alert('Username already exists. Please choose another one.');
      return;
    }

    users.push({
      username,
      password,
      points: 100,
    });

    writeJson(USERS_KEY, users);
    alert('Signup successful! Please login.');
    window.location.href = 'login.html';
  }

  function login() {
    const username = document.getElementById('login-username')?.value.trim();
    const password = document.getElementById('login-password')?.value;
    const users = readUsers();
    const user = users.find((entry) => entry.username === username && entry.password === password);

    if (!user) {
      alert('Invalid username or password.');
      return;
    }

    setCurrentUser(user);
    window.location.href = 'deadpool.html';
  }

  function logout() {
    setCurrentUser(null);
    window.location.href = 'login.html';
  }

  function bindKeyboardShortcuts() {
    const loginPassword = document.getElementById('login-password');
    const signupPassword = document.getElementById('signup-password');

    [loginPassword, signupPassword].filter(Boolean).forEach((input) => {
      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') {
          return;
        }

        event.preventDefault();
        if (input.id === 'login-password') {
          login();
        } else {
          signup();
        }
      });
    });
  }

  function init() {
    window.signup = signup;
    window.login = login;
    window.logout = logout;
    window.displayUserPoints = displayUserPoints;

    bindKeyboardShortcuts();
    displayUserPoints();
  }

  init();
})();
