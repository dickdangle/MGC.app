// Initialize bounties from local storage or as an empty array
let bounties = JSON.parse(localStorage.getItem('bounties')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Function to add a bounty
function addBounty() {
    const description = document.getElementById('bounty-description').value;
    const cost = parseInt(document.getElementById('bounty-cost').value);
    const reward = parseInt(document.getElementById('bounty-reward').value);

    if (description && !isNaN(cost) && !isNaN(reward)) {
        bounties.push({ description, cost, reward, completed: false, signups: [] });
        localStorage.setItem('bounties', JSON.stringify(bounties));
        document.getElementById('bounty-description').value = '';
        document.getElementById('bounty-cost').value = '';
        document.getElementById('bounty-reward').value = '';
        updateBounties();
    }
}

// Function to update the bounty display
function updateBounties() {
    const bountyContainer = document.getElementById('bounties');
    bountyContainer.innerHTML = '';

    bounties.forEach((bounty, index) => {
        const bountyElement = document.createElement('div');
        bountyElement.classList.add('bounty');

        bountyElement.innerHTML = `
            <span>${bounty.description}</span>
            <span>Cost: ${bounty.cost}</span>
            <span>Reward: ${bounty.reward}</span>
            <button onclick="signUpForBounty(${index})">Sign Up</button>
            <button onclick="betOnBounty(${index}, true)">Bet Complete</button>
            <button onclick="betOnBounty(${index}, false)">Bet Incomplete</button>
        `;

        bountyContainer.appendChild(bountyElement);
    });
}

// Function to sign up for a bounty
function signUpForBounty(index) {
    if (currentUser.points >= bounties[index].cost) {
        bounties[index].signups.push(currentUser.username);
        currentUser.points -= bounties[index].cost;
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
    const bet = {
        user: currentUser.username,
        willComplete,
        points: bounties[index].cost / 2,
    };

    bounties[index].bets = bounties[index].bets || [];
    bounties[index].bets.push(bet);
    localStorage.setItem('bounties', JSON.stringify(bounties));
    alert('Your bet has been placed.');
}

// Function to complete a bounty (to be triggered by admin or specific logic)
function completeBounty(index) {
    bounties[index].completed = true;
    bounties[index].signups.forEach(username => {
        const user = users.find(user => user.username === username);
        if (user) {
            user.points += bounties[index].reward;
        }
    });

    bounties[index].bets.forEach(bet => {
        const user = users.find(user => user.username === bet.user);
        if (user) {
            if (bet.willComplete === bounties[index].completed) {
                user.points += bet.points;
            } else {
                user.points -= bet.points;
            }
        }
    });

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('bounties', JSON.stringify(bounties));
    updateBounties();
}

// On page load, update the bounties
if (document.getElementById('bounties')) {
    updateBounties();
}
