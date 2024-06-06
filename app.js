<<<<<<< HEAD
// Initialize players from local storage or as an empty array
let players = JSON.parse(localStorage.getItem('players')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'TestUser', points: 100 }; // Mock user for testing

// Save currentUser to local storage if not already present
if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Function to add a player to the scoreboard
function addPlayer() {
    const playerName = document.getElementById('player-name').value;
    if (playerName) {
        players.push({ name: playerName, totalPoints: 0, scoreBounties: 0, scorePeerAward: 0, scoreMemelord: 0 });
        localStorage.setItem('players', JSON.stringify(players));
        document.getElementById('player-name').value = '';
        updateScoreboard();
        updatePointControls();
    }
}

// Function to update the scoreboard display
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';

    // Sort players by total score (sum of all categories) in descending order
    players.sort((a, b) => b.totalPoints - a.totalPoints);

    players.forEach((player) => {
        const totalScore = player.scoreBounties + player.scorePeerAward + player.scoreMemelord;
        player.totalPoints = totalScore; // Update the total points
        const playerElement = document.createElement('div');
        playerElement.classList.add('player');

        playerElement.innerHTML = `
            <span>${player.name}: ${totalScore}</span>
            <div>
                <span>🏹 ${player.scoreBounties}</span>
                <span>🤝 ${player.scorePeerAward}</span>
                <span>🃏 ${player.scoreMemelord}</span>
            </div>
        `;

        scoreboard.appendChild(playerElement);
    });

    localStorage.setItem('players', JSON.stringify(players));
    displayUserPoints(); // Display user points
}

// Function to display the current user's points
function displayUserPoints() {
    const userPointsElement = document.getElementById('user-points');
    userPointsElement.innerHTML = `Current User Points: ${currentUser.points}`;
}

// Function to update the point control buttons
function updatePointControls() {
    const pointControls = document.getElementById('point-controls');
    pointControls.innerHTML = '';

    players.forEach((player, index) => {
        const playerControls = document.createElement('div');
        playerControls.classList.add('player-controls');

        playerControls.innerHTML = `
            <span>${player.name}</span>
            <div>
                <span>🏹</span>
                <button onclick="incrementScore(${index}, 'scoreBounties')">+</button>
                <button onclick="decrementScore(${index}, 'scoreBounties')">-</button>
                <span>🤝</span>
                <button onclick="incrementScore(${index}, 'scorePeerAward')">+</button>
                <button onclick="decrementScore(${index}, 'scorePeerAward')">-</button>
                <span>🃏</span>
                <button onclick="incrementScore(${index}, 'scoreMemelord')">+</button>
                <button onclick="decrementScore(${index}, 'scoreMemelord')">-</button>
            </div>
        `;

        pointControls.appendChild(playerControls);
    });
}

// Function to increment a player's score
function incrementScore(index, category) {
    players[index][category]++;
    updatePlayerTotalPoints(index); // Update the player's total points
    localStorage.setItem('players', JSON.stringify(players));
    updateScoreboard();
    updatePointControls();
}

// Function to decrement a player's score
function decrementScore(index, category) {
    players[index][category]--;
    updatePlayerTotalPoints(index); // Update the player's total points
    localStorage.setItem('players', JSON.stringify(players));
    updateScoreboard();
    updatePointControls();
}

// Function to update a player's total points
function updatePlayerTotalPoints(index) {
    const player = players[index];
    player.totalPoints = player.scoreBounties + player.scorePeerAward + player.scoreMemelord;
    localStorage.setItem('players', JSON.stringify(players));
}

// On page load, update the scoreboard, point controls, and display user points if on the app page
if (document.getElementById('scoreboard')) {
    updateScoreboard();
    updatePointControls();
    displayUserPoints(); // Display user points
}
=======
// Function to handle login
function login() {
    const playerName = document.getElementById('player-name').value;
    if (playerName) {
        localStorage.setItem('playerName', playerName);
        window.location.href = 'app.html';
    }
}

// Initialize players from local storage or as an empty array
let players = JSON.parse(localStorage.getItem('players')) || [];

// Function to add a player to the scoreboard
function addPlayer() {
    const playerName = document.getElementById('player-name').value;
    if (playerName) {
        players.push({ name: playerName, scoreBounties: 0, scorePeerAward: 0, scoreMemelord: 0 });
        localStorage.setItem('players', JSON.stringify(players));
        document.getElementById('player-name').value = '';
        updateScoreboard();
        updatePointControls();
    }
}

// Function to update the scoreboard display
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';

    // Sort players by total score (sum of all categories) in descending order
    players.sort((a, b) => (b.scoreBounties + b.scorePeerAward + b.scoreMemelord) - (a.scoreBounties + a.scorePeerAward + a.scoreMemelord));

    players.forEach((player) => {
        const totalScore = player.scoreBounties + player.scorePeerAward + player.scoreMemelord;
        const playerElement = document.createElement('div');
        playerElement.classList.add('player');

        playerElement.innerHTML = `
            <span>${player.name}: ${totalScore}</span>
            <div>
                <span>🏹 ${player.scoreBounties}</span>
                <span>🤝 ${player.scorePeerAward}</span>
                <span>🃏 ${player.scoreMemelord}</span>
            </div>
        `;

        scoreboard.appendChild(playerElement);
    });

    localStorage.setItem('players', JSON.stringify(players));
}

// Function to update the point control buttons
function updatePointControls() {
    const pointControls = document.getElementById('point-controls');
    pointControls.innerHTML = '';

    players.forEach((player, index) => {
        const playerControls = document.createElement('div');
        playerControls.classList.add('player-controls');

        playerControls.innerHTML = `
            <span>${player.name}</span>
            <div>
                <span>🏹</span>
                <button onclick="incrementScore(${index}, 'scoreBounties')">+</button>
                <button onclick="decrementScore(${index}, 'scoreBounties')">-</button>
                <span>🤝</span>
                <button onclick="incrementScore(${index}, 'scorePeerAward')">+</button>
                <button onclick="decrementScore(${index}, 'scorePeerAward')">-</button>
                <span>🃏</span>
                <button onclick="incrementScore(${index}, 'scoreMemelord')">+</button>
                <button onclick="decrementScore(${index}, 'scoreMemelord')">-</button>
            </div>
        `;

        pointControls.appendChild(playerControls);
    });
}

// Function to increment a player's score
function incrementScore(index, category) {
    players[index][category]++;
    updateScoreboard();
    updatePointControls();
}

// Function to decrement a player's score
function decrementScore(index, category) {
    players[index][category]--;
    updateScoreboard();
    updatePointControls();
}

// On page load, update the scoreboard and point controls if on the app page
if (document.getElementById('scoreboard')) {
    updateScoreboard();
    updatePointControls();
}
>>>>>>> e9eaefd1058ad34c134c7c05aafe49409b816cd7
