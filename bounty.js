// Initialize bounties and currentUser from local storage or as default values
let bounties = JSON.parse(localStorage.getItem('bounties')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || { username: 'TestUser', points: 100 }; // Mock user for testing

// Save mock user for testing purposes if not already present
if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

document.getElementById('add-bounty-button').addEventListener('click', addBounty);

// Function to add a bounty
function addBounty() {
    const description = document.getElementById('bounty-description').value;
    const cost = parseInt(document.getElementById('bounty-cost').value);
    const reward = parseInt(document.getElementById('bounty-reward').value);

    console.log('Adding bounty:', description, cost, reward); // Debug log

    if (description && !isNaN(cost) && !isNaN(reward)) {
        bounties.push({ description, cost, reward, completed: false, signups: [], bets: [] });
        localStorage.setItem('bounties', JSON.stringify(bounties));
        document.getElementById('bounty-description').value = '';
        document.getElementById('bounty-cost').value = '';
        document.getElementById('bounty-reward').value = '';
        updateBounties();
    } else {
        console.log('Invalid input'); // Debug log
    }
}

// Function to update the bounty display
function updateBounties() {
    const bountyContainer = document.getElementById('bounties');
    bountyContainer.innerHTML = '';

    bounties.forEach((bounty, index) => {
        const bountyElement = document.createElement('div');
        bountyElement.classList.add('bounty');

        const signedUpUsers = bounty.signups.map(signup => `<span>${signup.username} (Spent: ${signup.points} points)</span>`).join('');
        const betButtons = bounty.signups.length > 0 ? `
            <button onclick="betOnBounty(${index}, true)">Bet Complete</button>
            <button onclick="betOnBounty(${index}, false)">Bet Incomplete</button>
        ` : '';

        bountyElement.innerHTML = `
            <div class="bounty-controls">
                <span>${bounty.description}</span>
                <span>Cost: ${bounty.cost}</span>
                <span>Reward: ${bounty.reward}</span>
                <input type="number" id="signup-points-${index}" placeholder="Points to Spend">
                <button onclick="signUpForBounty(${index})">Sign Up</button>
            </div>
            <div class="signed-up-users">
                <strong>Signed Up Users:</strong>
                ${signedUpUsers || '<span>No users signed up yet</span>'}
            </div>
            ${betButtons}
        `;

        bountyContainer.appendChild(bountyElement);
    });

    console.log('Bounties updated:', bounties); // Debug log
    console.log('Current User:', currentUser); // Debug log
}

// Function to sign up for a bounty
function signUpForBounty(index) {
    const points = parseInt(document.getElementById(`signup-points-${index}`).value);
    console.log('Trying to sign up with points:', points); // Debug log

    if (isNaN(points) || points <= 0) {
        alert('Please enter a valid number of points to spend.');
        return;
    }

    console.log('Current user points:', currentUser.points); // Debug log

    if (currentUser.points >= points) {
        bounties[index].signups.push({ username: currentUser.username, points });
        currentUser.points -= points;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('bounties', JSON.stringify(bounties));
        updateBounties();
        alert('You have signed up for the bounty.');
    } else {
        alert('Not enough points to sign up for this bounty.');
    }
}

// Function to bet on a bounty
function betOnBounty(index, willComplete) {
    const betPoints = prompt('Enter the number of points you want to bet:');
    const points = parseInt(betPoints);

    if (isNaN(points) || points <= 0) {
        alert('Please enter a valid number of points to bet.');
        return;
    }

    console.log('Current user points for betting:', currentUser.points); // Debug log

    if (currentUser.points >= points) {
        const bet = {
            user: currentUser.username,
            willComplete,
            points,
        };

        bounties[index].bets.push(bet);
        currentUser.points -= points;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('bounties', JSON.stringify(bounties));
        alert('Your bet has been placed.');
        updateBounties();
    } else {
        alert('Not enough points to place this bet.');
    }
}

// Function to display the current user's points
function displayUserPoints() {
    const userPointsElement = document.getElementById('user-points');
    userPointsElement.innerHTML = `Current User Points: ${currentUser.points}`;
}

// On page load, update the bounties and display user points if on the bounty board page
if (document.getElementById('bounties')) {
    updateBounties();
    displayUserPoints(); // Display user points
}
