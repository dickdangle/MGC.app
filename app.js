/*
 * Legacy compatibility stub.
 * The active static prototype logic lives in deadpool.js, bounty.js, and users.js.
 * Keep this file tiny so the repo reads like a lightweight static app, not a split stack.
 */
(function () {
  if (typeof window === 'undefined') {
    return;
  }

  window.MGCApp = window.MGCApp || {
    legacy: true,
    note: 'Static prototype entry point',
  };
})();
