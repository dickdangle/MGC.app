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
