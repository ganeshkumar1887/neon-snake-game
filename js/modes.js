/**
 * NEON SNAKE - Game Modes Module
 * Defines and configures the 4 playable game modes:
 * 1. INFINITY MODE (Endless wrap-around, speed scaling)
 * 2. CLASSIC MODE (Traditional wall & self collision)
 * 3. TIME ATTACK MODE (60-second countdown rush with frequent bonus foods)
 * 4. OBSTACLE MODE (10 progressive obstacle maps with level-clear mechanics)
 */

const GameModes = (() => {
  const MODES = {
    infinity: {
      id: 'infinity',
      name: 'Infinity Mode',
      badge: 'ENDLESS',
      icon: '<svg viewBox="0 0 24 24" class="svg-mode-badge-icon"><path fill="currentColor" d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.98l-2.83-2.83A5.334 5.334 0 0 0 5.4 6.62a5.38 5.38 0 0 0-5.4 5.38c0 2.97 2.43 5.38 5.4 5.38 1.44 0 2.8-.56 3.77-1.53L12 13.02l2.83 2.83c.97.97 2.33 1.53 3.77 1.53 2.97 0 5.4-2.41 5.4-5.38 0-2.97-2.43-5.38-5.4-5.38zm-13.2 8.76c-1.87 0-3.38-1.52-3.38-3.38 0-1.87 1.51-3.38 3.38-3.38 1 0 1.95.42 2.62 1.09L10.3 12l-2.28 2.29c-.67.67-1.62 1.09-2.62 1.09zm13.2 0c-1 0-1.95-.42-2.62-1.09L13.7 12l2.28-2.29c.67-.67 1.62-1.09 2.62-1.09 1.87 0 3.38 1.51 3.38 3.38 0 1.86-1.51 3.38-3.38 3.38z"/></svg>',
      tagline: 'Endless slither with wall wrap-around. Never stops!',
      description: 'Walls wrap around seamlessly. Speed gradually scales up as you grow. Game ends only when colliding with your own body.',
      wrapWalls: true,
      hasTimer: false,
      hasObstacles: false,
      bonusFrequency: 4, // bonus every 4 foods
      speedScaling: true
    },
    classic: {
      id: 'classic',
      name: 'Classic Mode',
      badge: 'VINTAGE',
      icon: '<svg viewBox="0 0 24 24" class="svg-mode-badge-icon"><path fill="currentColor" d="M19 8c-.6 0-1.1.2-1.5.6l-3.1 3.1c-.4.4-1 .6-1.5.6s-1.1-.2-1.5-.6l-1.1-1.1c-.8-.8-1.9-1.2-3-1.2H4c-1.1 0-2 .9-2 2s.9 2 2 2h3.3c.5 0 1 .2 1.4.6l1.1 1.1c.8.8 1.9 1.2 3 1.2s2.2-.4 3-1.2l3.1-3.1c.4-.4 1-.6 1.5-.6s1 .2 1.4.6l.7.7c.4.4 1 .4 1.4 0s.4-1 0-1.4l-.7-.7c-.8-.8-1.9-1.3-3.1-1.3zm0-3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/></svg>',
      tagline: 'Traditional arcade snake. Pure skill & precision.',
      description: 'Standard perimeter walls. Hitting walls or your own tail causes instant death. 3 selectable difficulties.',
      wrapWalls: false,
      hasTimer: false,
      hasObstacles: false,
      bonusFrequency: 4,
      speedScaling: true
    },
    timeAttack: {
      id: 'timeAttack',
      name: 'Time Attack',
      badge: '60 SECONDS',
      icon: '<svg viewBox="0 0 24 24" class="svg-mode-badge-icon"><path fill="currentColor" d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>',
      tagline: 'Race the clock! 60s countdown with bonus frenzy.',
      description: 'Collect as much food as possible in 60 seconds. Golden star bonus pellets spawn rapidly with massive score multipliers!',
      wrapWalls: false,
      hasTimer: true,
      timerSeconds: 60,
      hasObstacles: false,
      bonusFrequency: 2, // bonus every 2 foods
      speedScaling: false
    },
    obstacle: {
      id: 'obstacle',
      name: 'Obstacle Mode',
      badge: '10 LEVELS',
      icon: '<svg viewBox="0 0 24 24" class="svg-mode-badge-icon"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
      tagline: 'Navigate 10 challenging maze layouts & barriers.',
      description: 'Eat 5 pellets per stage to open the next sector. Avoid crashing into barriers, perimeter walls, and your own body.',
      wrapWalls: false,
      hasTimer: false,
      hasObstacles: true,
      targetFoodPerLevel: 5,
      maxLevel: 10,
      bonusFrequency: 5,
      speedScaling: true
    }
  };

  let currentModeId = 'classic';

  return {
    init() {
      currentModeId = Storage.getSelectedMode() || 'classic';
      if (!MODES[currentModeId]) currentModeId = 'classic';
    },

    getAll() {
      return Object.values(MODES);
    },

    getMode(modeId) {
      return MODES[modeId] || MODES.classic;
    },

    getCurrentModeId() {
      return currentModeId;
    },

    getCurrentMode() {
      return this.getMode(currentModeId);
    },

    setMode(modeId) {
      if (MODES[modeId]) {
        currentModeId = modeId;
        Storage.saveSelectedMode(modeId);
        return MODES[modeId];
      }
      return MODES.classic;
    }
  };
})();
