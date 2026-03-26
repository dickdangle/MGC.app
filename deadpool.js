(function () {
  'use strict';

  const STORAGE_KEY = 'players';
  const CATEGORY_KEYS = ['scoreBounties', 'scorePeerAward', 'scoreMemelord'];

  function readPlayers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(normalizePlayer) : [];
    } catch {
      return [];
    }
  }

  function savePlayers(players) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players.map(normalizePlayer)));
  }

  function normalizePlayer(player) {
    return {
      name: String(player?.name || 'Unnamed'),
      totalPoints: Number.isFinite(player?.totalPoints) ? player.totalPoints : 0,
      scoreBounties: Number.isFinite(player?.scoreBounties) ? player.scoreBounties : 0,
      scorePeerAward: Number.isFinite(player?.scorePeerAward) ? player.scorePeerAward : 0,
      scoreMemelord: Number.isFinite(player?.scoreMemelord) ? player.scoreMemelord : 0,
    };
  }

  function scoreOf(player) {
    return CATEGORY_KEYS.reduce((total, key) => total + (Number(player[key]) || 0), 0);
  }

  function getScoreboardEl() {
    return document.getElementById('scoreboard');
  }

  function getControlsEl() {
    return document.getElementById('point-controls');
  }

  function getNameInputEl() {
    return document.getElementById('player-name');
  }

  let players = readPlayers();

  function sync() {
    players = players.map(normalizePlayer).sort((a, b) => scoreOf(b) - scoreOf(a));
    players.forEach((player) => {
      player.totalPoints = scoreOf(player);
    });
    savePlayers(players);
  }

  function renderUserPoints() {
    if (typeof window.displayUserPoints === 'function') {
      window.displayUserPoints();
    }
  }

  function renderScoreboard() {
    const scoreboard = getScoreboardEl();
    if (!scoreboard) {
      return;
    }

    sync();

    if (players.length === 0) {
      scoreboard.innerHTML = '<div class="player empty-state">No players yet. Add one to start the board.</div>';
      renderPointControls();
      renderUserPoints();
      return;
    }

    scoreboard.innerHTML = players
      .map((player, index) => {
        return [
          '<div class="player">',
          `<span>${player.name}: ${player.totalPoints}</span>`,
          '<div class="player-breakdown">',
          `<span>🏹 ${player.scoreBounties}</span>`,
          `<span>🤝 ${player.scorePeerAward}</span>`,
          `<span>🃏 ${player.scoreMemelord}</span>`,
          '</div>',
          '<div class="player-actions">',
          `<button type="button" data-action="score" data-index="${index}" data-category="scoreBounties" data-delta="1">+ Bounty</button>`,
          `<button type="button" data-action="score" data-index="${index}" data-category="scorePeerAward" data-delta="1">+ Peer</button>`,
          `<button type="button" data-action="score" data-index="${index}" data-category="scoreMemelord" data-delta="1">+ Meme</button>`,
          '</div>',
          '</div>',
        ].join('');
      })
      .join('');

    renderPointControls();
    renderUserPoints();
  }

  function renderPointControls() {
    const pointControls = getControlsEl();
    if (!pointControls) {
      return;
    }

    pointControls.innerHTML = players
      .map((player, index) => {
        return [
          '<div class="player-controls">',
          `<span>${player.name}</span>`,
          '<div>',
          `<span>🏹</span>`,
          `<button type="button" data-action="score" data-index="${index}" data-category="scoreBounties" data-delta="1">+</button>`,
          `<button type="button" data-action="score" data-index="${index}" data-category="scoreBounties" data-delta="-1">-</button>`,
          `<span>🤝</span>`,
          `<button type="button" data-action="score" data-index="${index}" data-category="scorePeerAward" data-delta="1">+</button>`,
          `<button type="button" data-action="score" data-index="${index}" data-category="scorePeerAward" data-delta="-1">-</button>`,
          `<span>🃏</span>`,
          `<button type="button" data-action="score" data-index="${index}" data-category="scoreMemelord" data-delta="1">+</button>`,
          `<button type="button" data-action="score" data-index="${index}" data-category="scoreMemelord" data-delta="-1">-</button>`,
          '</div>',
          '</div>',
        ].join('');
      })
      .join('');
  }

  function addPlayer() {
    const input = getNameInputEl();
    if (!input) {
      return;
    }

    const name = input.value.trim();
    if (!name) {
      return;
    }

    players.push({
      name,
      totalPoints: 0,
      scoreBounties: 0,
      scorePeerAward: 0,
      scoreMemelord: 0,
    });

    input.value = '';
    renderScoreboard();
  }

  function changeScore(index, category, delta) {
    const player = players[index];
    if (!player || !CATEGORY_KEYS.includes(category)) {
      return;
    }

    player[category] = Math.max(0, (Number(player[category]) || 0) + delta);
    renderScoreboard();
  }

  function handleControlsClick(event) {
    const button = event.target.closest('button[data-action="score"]');
    if (!button) {
      return;
    }

    const index = Number(button.dataset.index);
    const category = button.dataset.category;
    const delta = Number(button.dataset.delta);
    changeScore(index, category, delta);
  }

  function bindKeyboardShortcuts() {
    const input = getNameInputEl();
    if (!input) {
      return;
    }

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addPlayer();
      }
    });
  }

  function init() {
    const scoreboard = getScoreboardEl();
    if (!scoreboard) {
      return;
    }

    const controls = getControlsEl();
    if (controls) {
      controls.addEventListener('click', handleControlsClick);
    }

    window.addPlayer = addPlayer;
    window.incrementScore = (index, category) => changeScore(index, category, 1);
    window.decrementScore = (index, category) => changeScore(index, category, -1);

    bindKeyboardShortcuts();
    renderScoreboard();
  }

  init();
})();
