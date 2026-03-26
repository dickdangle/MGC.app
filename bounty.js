(function () {
  'use strict';

  const BOUNTY_KEY = 'bounties';
  const USER_KEY = 'currentUser';

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

  function readBounties() {
    const bounties = readJson(BOUNTY_KEY, []);
    return Array.isArray(bounties) ? bounties.map(normalizeBounty) : [];
  }

  function normalizeBounty(bounty) {
    return {
      description: String(bounty?.description || ''),
      cost: Number.isFinite(bounty?.cost) ? bounty.cost : 0,
      reward: Number.isFinite(bounty?.reward) ? bounty.reward : 0,
      completed: Boolean(bounty?.completed),
      signups: Array.isArray(bounty?.signups) ? bounty.signups : [],
      bets: Array.isArray(bounty?.bets) ? bounty.bets : [],
    };
  }

  function getBoardEl() {
    return document.getElementById('bounties');
  }

  function getDescriptionEl() {
    return document.getElementById('bounty-description');
  }

  function getCostEl() {
    return document.getElementById('bounty-cost');
  }

  function getRewardEl() {
    return document.getElementById('bounty-reward');
  }

  let bounties = readBounties();

  function currentUser() {
    return readJson(USER_KEY, null);
  }

  function persist() {
    writeJson(BOUNTY_KEY, bounties.map(normalizeBounty));
  }

  function renderUserPoints() {
    if (typeof window.displayUserPoints === 'function') {
      window.displayUserPoints();
    }
  }

  function renderBounties() {
    const board = getBoardEl();
    if (!board) {
      return;
    }

    bounties = bounties.map(normalizeBounty);

    if (bounties.length === 0) {
      board.innerHTML = '<div class="bounty empty-state">No bounties yet. Add one to start the board.</div>';
      renderUserPoints();
      return;
    }

    board.innerHTML = bounties
      .map((bounty, index) => {
        const signups = bounty.signups.length
          ? bounty.signups.map((signup) => `<span>${signup.username} (Spent: ${signup.points} points)</span>`).join('')
          : '<span>No users signed up yet</span>';

        const betButtons = bounty.signups.length
          ? [
              '<div class="bounty-actions">',
              `<button type="button" data-action="bet" data-index="${index}" data-complete="true">Bet Complete</button>`,
              `<button type="button" data-action="bet" data-index="${index}" data-complete="false">Bet Incomplete</button>`,
              '</div>',
            ].join('')
          : '';

        return [
          '<div class="bounty">',
          '<div class="bounty-controls">',
          `<span>${bounty.description}</span>`,
          `<span>Cost: ${bounty.cost}</span>`,
          `<span>Reward: ${bounty.reward}</span>`,
          `<input type="number" id="signup-points-${index}" placeholder="Points to Spend" min="1">`,
          `<button type="button" data-action="signup" data-index="${index}">Sign Up</button>`,
          '</div>',
          '<div class="signed-up-users">',
          '<strong>Signed Up Users:</strong>',
          signups,
          '</div>',
          betButtons,
          '</div>',
        ].join('');
      })
      .join('');

    renderUserPoints();
  }

  function addBounty() {
    const description = getDescriptionEl()?.value.trim();
    const cost = Number(getCostEl()?.value);
    const reward = Number(getRewardEl()?.value);

    if (!description || !Number.isFinite(cost) || !Number.isFinite(reward)) {
      return;
    }

    bounties.push({
      description,
      cost,
      reward,
      completed: false,
      signups: [],
      bets: [],
    });

    if (getDescriptionEl()) getDescriptionEl().value = '';
    if (getCostEl()) getCostEl().value = '';
    if (getRewardEl()) getRewardEl().value = '';

    persist();
    renderBounties();
  }

  function signUpForBounty(index) {
    const user = currentUser();
    const bounty = bounties[index];
    const pointsInput = document.getElementById(`signup-points-${index}`);
    const points = Number(pointsInput?.value);

    if (!user) {
      alert('Please log in first.');
      return;
    }

    if (!bounty || !Number.isFinite(points) || points <= 0) {
      alert('Please enter a valid number of points to spend.');
      return;
    }

    if (Number(user.points) < points) {
      alert('Not enough points to sign up for this bounty.');
      return;
    }

    bounty.signups.push({ username: user.username, points });
    user.points -= points;
    writeJson(USER_KEY, user);
    persist();
    renderBounties();
    alert('You have signed up for the bounty.');
  }

  function betOnBounty(index, willComplete) {
    const user = currentUser();
    const bounty = bounties[index];

    if (!user) {
      alert('Please log in first.');
      return;
    }

    if (!bounty) {
      return;
    }

    const betPoints = prompt('Enter the number of points you want to bet:');
    const points = Number(betPoints);

    if (!Number.isFinite(points) || points <= 0) {
      alert('Please enter a valid number of points to bet.');
      return;
    }

    if (Number(user.points) < points) {
      alert('Not enough points to place this bet.');
      return;
    }

    bounty.bets.push({
      user: user.username,
      willComplete,
      points,
    });

    user.points -= points;
    writeJson(USER_KEY, user);
    persist();
    renderBounties();
    alert('Your bet has been placed.');
  }

  function handleBoardClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) {
      return;
    }

    const index = Number(button.dataset.index);
    const action = button.dataset.action;

    if (action === 'signup') {
      signUpForBounty(index);
      return;
    }

    if (action === 'bet') {
      betOnBounty(index, button.dataset.complete === 'true');
    }
  }

  function bindKeyboardShortcuts() {
    [getDescriptionEl(), getCostEl(), getRewardEl()]
      .filter(Boolean)
      .forEach((input) => {
        input.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            addBounty();
          }
        });
      });
  }

  function init() {
    const board = getBoardEl();
    if (!board) {
      return;
    }

    const addButton = document.getElementById('add-bounty-button');
    if (addButton) {
      addButton.addEventListener('click', addBounty);
    }

    board.addEventListener('click', handleBoardClick);

    window.addBounty = addBounty;
    window.signUpForBounty = signUpForBounty;
    window.betOnBounty = betOnBounty;

    bindKeyboardShortcuts();
    renderBounties();
  }

  init();
})();
