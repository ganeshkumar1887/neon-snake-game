/**
 * NEON SNAKE - Persistent Storage & Analytics Module
 * Manages game modes, theme preferences, player statistics, settings,
 * multi-mode high scores, and persistent achievements.
 */

const Storage = (() => {
  const KEYS = {
    BEST_SCORE: 'neon_snake_best_score',
    MODE_SCORES: 'neon_snake_mode_scores',
    LEADERBOARD: 'neon_snake_leaderboard',
    SETTINGS: 'neon_snake_settings',
    ACHIEVEMENTS: 'neon_snake_achievements',
    STATS: 'neon_snake_stats',
    THEME: 'neon_snake_theme',
    CURRENT_MODE: 'neon_snake_current_mode',
    PLAYER_NAME: 'neon_snake_player_name'
  };

  const isAvailable = () => {
    try {
      const test = '__neon_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  };

  const hasStorage = isAvailable();
  const memoryStore = {};

  const getItem = (key, fallback = null) => {
    try {
      if (hasStorage) {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : fallback;
      }
      return memoryStore[key] ? JSON.parse(memoryStore[key]) : fallback;
    } catch (e) {
      console.warn('Storage read error:', e);
      return fallback;
    }
  };

  const setItem = (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      if (hasStorage) {
        localStorage.setItem(key, serialized);
      } else {
        memoryStore[key] = serialized;
      }
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  };

  // Pre-defined Achievements definitions matching requirements
  const DEFAULT_ACHIEVEMENTS = [
    { id: 'first_food', title: 'First Food', desc: 'Collect your very first food item', icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FF777D" d="M12 2C8.5 2 6 4.5 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.5-2.5-6-6-6zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>' },
    { id: 'score_100', title: 'Snake Master', desc: 'Reach 100 points in any mode', icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FFE987" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/></svg>' },
    { id: 'speed_demon', title: 'Speed Demon', desc: 'Score 150+ points on HARD difficulty', icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FF9671" d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>' },
    { id: 'survivor', title: 'Survivor', desc: 'Survive for 5 minutes continuously', icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#A9E7EC" d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>' },
    { id: 'time_champion', title: 'Time Champion', desc: 'Achieve 200 points in Time Attack mode', icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FFE987" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H8v2h8v-2h-3v-3.1c1.99-.44 3.55-2.02 3.61-4.06C19.08 11.63 21 9.55 21 7V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>' },
    { id: 'obstacle_explorer', title: 'Obstacle Explorer', desc: 'Complete 10 obstacle levels', icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#BFA5FF" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>' },
    { id: 'theme_collector', title: 'Chameleon', desc: 'Customise your snake with different themes', icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#A9EDB0" d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.64 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-5 9c-.83 0-1.5-.67-1.5-1.5S6.17 9 7 9s1.5.67 1.5 1.5S7.83 12 7 12zm3-4c-.83 0-1.5-.67-1.5-1.5S9.17 5 10 5s1.5.67 1.5 1.5S10.83 8 10 8zm4 0c-.83 0-1.5-.67-1.5-1.5S13.17 5 14 5s1.5.67 1.5 1.5S14.83 8 14 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.17 9 17 9s1.5.67 1.5 1.5S17.83 12 17 12z"/></svg>' },
    { id: 'infinity_legend', title: 'Infinity Legend', desc: 'Reach 300 points in Infinity Mode', icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#BFA5FF" d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.98l-2.83-2.83A5.334 5.334 0 0 0 5.4 6.62a5.38 5.38 0 0 0-5.4 5.38c0 2.97 2.43 5.38 5.4 5.38 1.44 0 2.8-.56 3.77-1.53L12 13.02l2.83 2.83c.97.97 2.33 1.53 3.77 1.53 2.97 0 5.4-2.41 5.4-5.38 0-2.97-2.43-5.38-5.4-5.38zm-13.2 8.76c-1.87 0-3.38-1.52-3.38-3.38 0-1.87 1.51-3.38 3.38-3.38 1 0 1.95.42 2.62 1.09L10.3 12l-2.28 2.29c-.67.67-1.62 1.09-2.62 1.09zm13.2 0c-1 0-1.95-.42-2.62-1.09L13.7 12l2.28-2.29c.67-.67 1.62-1.09 2.62-1.09 1.87 0 3.38 1.51 3.38 3.38 0 1.86-1.51 3.38-3.38 3.38z"/></svg>' }
  ];

  // Default Player Statistics structure
  const DEFAULT_STATS = {
    gamesPlayed: 0,
    foodCollected: 0,
    highestOverallScore: 0,
    bestInfinityScore: 0,
    bestClassicScore: 0,
    bestTimeAttackScore: 0,
    obstacleLevelsCompleted: 0,
    totalPlaytimeSec: 0
  };

  // Default Player Settings
  const DEFAULT_SETTINGS = {
    // Audio
    soundEnabled: true,
    sfxEnabled: true,
    bgmEnabled: true,
    volume: 0.8, // 0.0 to 1.0

    // Gameplay
    difficulty: 'medium',
    snakeSpeedModifier: 1.0, // 0.8x to 1.4x
    controlSensitivity: 'normal',
    showGrid: true,
    showParticles: true,

    // Mobile
    vibration: true,
    touchControlSize: 'normal', // 'compact', 'normal', 'large'
    controlLayout: 'both', // 'dpad', 'swipe', 'both'

    // Display
    fullscreen: false,
    animationQuality: 'high' // 'high', 'low'
  };

  return {
    // Current Mode selection
    getSelectedMode() {
      return getItem(KEYS.CURRENT_MODE, 'classic');
    },

    saveSelectedMode(mode) {
      setItem(KEYS.CURRENT_MODE, mode);
    },

    // Best Score (Global and Per-Mode)
    getBestScore() {
      return getItem(KEYS.BEST_SCORE, 0);
    },

    saveBestScore(score) {
      const current = this.getBestScore();
      if (score > current) {
        setItem(KEYS.BEST_SCORE, score);
        return true;
      }
      return false;
    },

    getModeScores() {
      return getItem(KEYS.MODE_SCORES, {
        infinity: 0,
        classic: 0,
        timeAttack: 0,
        obstacle: 0
      });
    },

    getModeBestScore(mode) {
      const scores = this.getModeScores();
      return scores[mode] || 0;
    },

    saveModeBestScore(mode, score) {
      const scores = this.getModeScores();
      const current = scores[mode] || 0;
      let isNew = false;
      if (score > current) {
        scores[mode] = score;
        setItem(KEYS.MODE_SCORES, scores);
        isNew = true;
      }
      this.saveBestScore(score);
      return isNew;
    },

    // Theme Preference
    getTheme() {
      const stored = getItem(KEYS.THEME, 'pastel-world');
      // Migrate legacy dark themes if present
      if (stored === 'neon-green' || !stored) return 'pastel-world';
      return stored;
    },

    saveTheme(themeId) {
      setItem(KEYS.THEME, themeId);
      this.unlockAchievement('theme_collector');
    },

    // Player Profile Name
    getPlayerName() {
      return getItem(KEYS.PLAYER_NAME, 'Player 1');
    },

    savePlayerName(name) {
      const clean = (name && typeof name === 'string') ? name.trim().slice(0, 15) : 'Player 1';
      setItem(KEYS.PLAYER_NAME, clean || 'Player 1');
      return clean || 'Player 1';
    },

    // Settings
    getSettings() {
      const saved = getItem(KEYS.SETTINGS, {});
      return { ...DEFAULT_SETTINGS, ...saved };
    },

    saveSettings(settings) {
      const current = this.getSettings();
      const merged = { ...current, ...settings };
      setItem(KEYS.SETTINGS, merged);
      return merged;
    },

    resetSettings() {
      setItem(KEYS.SETTINGS, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    },

    // Player Statistics
    getStats() {
      const saved = getItem(KEYS.STATS, {});
      return { ...DEFAULT_STATS, ...saved };
    },

    recordGameStats({ mode, score, foodCount, playtimeSec, obstacleLevelsCleared = 0 }) {
      const stats = this.getStats();

      stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
      stats.foodCollected = (stats.foodCollected || 0) + (foodCount || 0);
      stats.totalPlaytimeSec = (stats.totalPlaytimeSec || 0) + Math.round(playtimeSec || 0);

      if (score > (stats.highestOverallScore || 0)) {
        stats.highestOverallScore = score;
      }

      if (mode === 'infinity' && score > (stats.bestInfinityScore || 0)) {
        stats.bestInfinityScore = score;
      } else if (mode === 'classic' && score > (stats.bestClassicScore || 0)) {
        stats.bestClassicScore = score;
      } else if (mode === 'timeAttack' && score > (stats.bestTimeAttackScore || 0)) {
        stats.bestTimeAttackScore = score;
      }

      if (obstacleLevelsCleared > 0) {
        stats.obstacleLevelsCompleted = (stats.obstacleLevelsCompleted || 0) + obstacleLevelsCleared;
      }

      setItem(KEYS.STATS, stats);
      return stats;
    },

    resetStats() {
      setItem(KEYS.STATS, DEFAULT_STATS);
      return DEFAULT_STATS;
    },

    // Leaderboard
    getLeaderboard() {
      return getItem(KEYS.LEADERBOARD, []);
    },

    addLeaderboardEntry(score, level, difficulty, mode = 'classic') {
      const list = this.getLeaderboard();
      const dateStr = new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      });

      list.push({
        score,
        level,
        difficulty: difficulty.toUpperCase(),
        mode: mode.toUpperCase(),
        date: dateStr,
        timestamp: Date.now()
      });

      list.sort((a, b) => b.score - a.score);
      const top10 = list.slice(0, 10);
      setItem(KEYS.LEADERBOARD, top10);
      return top10;
    },

    clearLeaderboard() {
      setItem(KEYS.LEADERBOARD, []);
      setItem(KEYS.BEST_SCORE, 0);
      setItem(KEYS.MODE_SCORES, { infinity: 0, classic: 0, timeAttack: 0, obstacle: 0 });
    },

    // Achievements
    getAchievementDefs() {
      return DEFAULT_ACHIEVEMENTS;
    },

    getUnlockedAchievements() {
      return getItem(KEYS.ACHIEVEMENTS, []);
    },

    unlockAchievement(id) {
      const unlocked = this.getUnlockedAchievements();
      if (!unlocked.includes(id)) {
        unlocked.push(id);
        setItem(KEYS.ACHIEVEMENTS, unlocked);
        const def = DEFAULT_ACHIEVEMENTS.find(a => a.id === id);
        return def || { id, title: 'Achievement Unlocked', desc: '', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>' };
      }
      return null;
    }
  };
})();
