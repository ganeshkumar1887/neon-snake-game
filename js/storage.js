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
    PLAYER_NAME: 'neon_snake_player_name',
    // Adventure, Economy & Customization Keys
    COINS: 'neon_snake_coins',
    ADVENTURE_PROGRESS: 'neon_snake_adventure',
    FASHION_SKIN: 'neon_snake_skin',
    FASHION_HAT: 'neon_snake_hat',
    FASHION_PATTERN: 'neon_snake_pattern',
    FASHION_UNLOCKED: 'neon_snake_fashion_unlocked',
    EVOLUTION_EXP: 'neon_snake_evolution_exp',
    DAILY_LOGIN: 'neon_snake_daily_login',
    DAILY_MISSIONS: 'neon_snake_daily_missions',
    GHOST_RUN: 'neon_snake_ghost_run',
    CLAIMED_ACHIEVEMENTS: 'neon_snake_claimed_achievements'
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
  const parsedCache = {};

  const cloneShallow = (val) => {
    if (Array.isArray(val)) return val.slice();
    if (val && typeof val === 'object') return { ...val };
    return val;
  };

  const getItem = (key, fallback = null) => {
    try {
      if (Object.prototype.hasOwnProperty.call(parsedCache, key)) {
        return cloneShallow(parsedCache[key]);
      }
      if (hasStorage) {
        const val = localStorage.getItem(key);
        if (val !== null) {
          const parsed = JSON.parse(val);
          parsedCache[key] = parsed;
          return cloneShallow(parsed);
        }
        return fallback;
      }
      if (memoryStore[key]) {
        const parsed = JSON.parse(memoryStore[key]);
        parsedCache[key] = parsed;
        return cloneShallow(parsed);
      }
      return fallback;
    } catch (e) {
      console.warn('Storage read error:', e);
      return fallback;
    }
  };

  const setItem = (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      parsedCache[key] = JSON.parse(serialized);
      if (hasStorage) {
        localStorage.setItem(key, serialized);
      } else {
        memoryStore[key] = serialized;
      }
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  };

  // Pre-defined Achievements definitions with coin rewards & adventure milestones
  const DEFAULT_ACHIEVEMENTS = [
    { id: 'first_food', title: 'First Food', desc: 'Collect your very first food item', reward: 50, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FF777D" d="M12 2C8.5 2 6 4.5 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.5-2.5-6-6-6zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>' },
    { id: 'score_100', title: 'Snake Master', desc: 'Reach 100 points in any mode', reward: 100, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FFE987" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/></svg>' },
    { id: 'first_rescue', title: 'Baby Rescuer', desc: 'Rescue your very first baby snake and bring it safely home', reward: 150, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#A9EDB0" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
    { id: 'speed_demon', title: 'Speed Demon', desc: 'Score 150+ points on HARD difficulty', reward: 150, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FF9671" d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>' },
    { id: 'survivor', title: 'Survivor', desc: 'Survive for 5 minutes continuously', reward: 200, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#A9E7EC" d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>' },
    { id: 'time_champion', title: 'Time Champion', desc: 'Achieve 200 points in Time Attack mode', reward: 150, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FFE987" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H8v2h8v-2h-3v-3.1c1.99-.44 3.55-2.02 3.61-4.06C19.08 11.63 21 9.55 21 7V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>' },
    { id: 'obstacle_explorer', title: 'Obstacle Explorer', desc: 'Complete 10 obstacle levels', reward: 200, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#BFA5FF" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>' },
    { id: 'world_candy', title: 'Sugar Explorer', desc: 'Unlock the delicious Candy World', reward: 200, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FF777D" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V18a1 1 0 0 1-2 0v-.07A8.006 8.006 0 0 1 4.07 13H5a1 1 0 0 1 0-2h-.93A8.006 8.006 0 0 1 11 4.07V5a1 1 0 0 1 2 0v-.93A8.006 8.006 0 0 1 19.93 11H19a1 1 0 0 1 0 2h.93A8.006 8.006 0 0 1 13 19.93z"/></svg>' },
    { id: 'fashion_star', title: 'Fashion Icon', desc: 'Equip your first hat or custom skin in the Fashion Studio', reward: 100, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#BFA5FF" d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z"/></svg>' },
    { id: 'super_power', title: 'Super Powered', desc: 'Collect 10 adventure power-ups', reward: 150, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FFE987" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>' },
    { id: 'evolution_mega', title: 'Mega Evolution', desc: 'Evolve your snake to Mega or Legendary stage', reward: 300, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#FFD700" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/></svg>' },
    { id: 'theme_collector', title: 'Chameleon', desc: 'Customise your snake with different themes', reward: 100, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#A9EDB0" d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.64 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-5 9c-.83 0-1.5-.67-1.5-1.5S6.17 9 7 9s1.5.67 1.5 1.5S7.83 12 7 12zm3-4c-.83 0-1.5-.67-1.5-1.5S9.17 5 10 5s1.5.67 1.5 1.5S10.83 8 10 8zm4 0c-.83 0-1.5-.67-1.5-1.5S13.17 5 14 5s1.5.67 1.5 1.5S14.83 8 14 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.17 9 17 9s1.5.67 1.5 1.5S17.83 12 17 12z"/></svg>' },
    { id: 'infinity_legend', title: 'Infinity Legend', desc: 'Reach 300 points in Infinity Mode', reward: 250, icon: '<svg viewBox="0 0 24 24" class="achieve-svg"><path fill="#BFA5FF" d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.98l-2.83-2.83A5.334 5.334 0 0 0 5.4 6.62a5.38 5.38 0 0 0-5.4 5.38c0 2.97 2.43 5.38 5.4 5.38 1.44 0 2.8-.56 3.77-1.53L12 13.02l2.83 2.83c.97.97 2.33 1.53 3.77 1.53 2.97 0 5.4-2.41 5.4-5.38 0-2.97-2.43-5.38-5.4-5.38zm-13.2 8.76c-1.87 0-3.38-1.52-3.38-3.38 0-1.87 1.51-3.38 3.38-3.38 1 0 1.95.42 2.62 1.09L10.3 12l-2.28 2.29c-.67.67-1.62 1.09-2.62 1.09zm13.2 0c-1 0-1.95-.42-2.62-1.09L13.7 12l2.28-2.29c.67-.67 1.62-1.09 2.62-1.09 1.87 0 3.38 1.51 3.38 3.38 0 1.86-1.51 3.38-3.38 3.38z"/></svg>' }
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
    totalPlaytimeSec: 0,
    // Adventure Stats
    babySnakesRescued: 0,
    powerupsCollected: 0,
    adventureLevelsCleared: 0,
    coinsEarnedTotal: 0
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
    lowFx: false, // Low FX / Eco Mode for smooth mobile play
    ghostRival: true, // Ghost rival replay comparison

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

    recordAdventureStats({ babyRescued = 0, powerups = 0, coins = 0, levelCleared = false }) {
      const stats = this.getStats();
      if (babyRescued > 0) {
        stats.babySnakesRescued = (stats.babySnakesRescued || 0) + babyRescued;
        if (stats.babySnakesRescued >= 1) this.unlockAchievement('first_rescue');
      }
      if (powerups > 0) {
        stats.powerupsCollected = (stats.powerupsCollected || 0) + powerups;
        if (stats.powerupsCollected >= 10) this.unlockAchievement('super_power');
      }
      if (coins > 0) {
        stats.coinsEarnedTotal = (stats.coinsEarnedTotal || 0) + coins;
      }
      if (levelCleared) {
        stats.adventureLevelsCleared = (stats.adventureLevelsCleared || 0) + 1;
      }
      setItem(KEYS.STATS, stats);
      return stats;
    },

    resetStats() {
      setItem(KEYS.STATS, DEFAULT_STATS);
      return DEFAULT_STATS;
    },

    // ==========================================
    // Virtual Coins & Economy System
    // ==========================================
    getCoins() {
      return getItem(KEYS.COINS, 100); // 100 welcome coins for new players!
    },

    addCoins(amount) {
      if (!amount || amount <= 0) return this.getCoins();
      const current = this.getCoins();
      const updated = current + Math.round(amount);
      setItem(KEYS.COINS, updated);
      const stats = this.getStats();
      stats.coinsEarnedTotal = (stats.coinsEarnedTotal || 0) + Math.round(amount);
      setItem(KEYS.STATS, stats);
      return updated;
    },

    spendCoins(amount) {
      if (!amount || amount <= 0) return true;
      const current = this.getCoins();
      if (current >= amount) {
        const updated = current - Math.round(amount);
        setItem(KEYS.COINS, updated);
        return true;
      }
      return false; // Insufficient coins
    },

    // ==========================================
    // Adventure Worlds & Level Progression
    // ==========================================
    getAdventureProgress() {
      return getItem(KEYS.ADVENTURE_PROGRESS, {
        unlockedWorlds: ['forest'],
        completedLevels: {}, // { 'forest_1': { stars: 3, bestScore: 240 } }
        currentWorld: 'forest',
        currentLevel: 1
      });
    },

    saveAdventureProgress(data) {
      setItem(KEYS.ADVENTURE_PROGRESS, data);
      return data;
    },

    completeAdventureLevel(worldId, levelNum, stars = 3, score = 0, coinsEarned = 50) {
      const progress = this.getAdventureProgress();
      const levelKey = `${worldId}_${levelNum}`;
      const existing = progress.completedLevels[levelKey] || { stars: 0, bestScore: 0 };

      progress.completedLevels[levelKey] = {
        stars: Math.max(existing.stars, stars),
        bestScore: Math.max(existing.bestScore, score),
        completedAt: Date.now()
      };

      // Check if this unlocks next level
      const nextLevel = levelNum + 1;
      if (nextLevel <= 5) {
        progress.currentLevel = Math.max(progress.currentLevel, nextLevel);
      } else {
        // Unlock next world if available
        const worldOrder = ['forest', 'candy', 'ice', 'desert'];
        const currentIdx = worldOrder.indexOf(worldId);
        if (currentIdx >= 0 && currentIdx < worldOrder.length - 1) {
          const nextWorld = worldOrder[currentIdx + 1];
          if (!progress.unlockedWorlds.includes(nextWorld)) {
            progress.unlockedWorlds.push(nextWorld);
            if (nextWorld === 'candy') this.unlockAchievement('world_candy');
          }
        }
      }

      this.saveAdventureProgress(progress);
      this.addCoins(coinsEarned);
      this.recordAdventureStats({ coins: coinsEarned, levelCleared: true });
      return progress;
    },

    // ==========================================
    // Snake Fashion Studio & Customization
    // ==========================================
    getEquippedSkin() {
      return getItem(KEYS.FASHION_SKIN, 'skin_green');
    },

    setEquippedSkin(skinId) {
      setItem(KEYS.FASHION_SKIN, skinId);
      this.unlockAchievement('fashion_star');
      return skinId;
    },

    getEquippedHat() {
      return getItem(KEYS.FASHION_HAT, 'hat_none');
    },

    setEquippedHat(hatId) {
      setItem(KEYS.FASHION_HAT, hatId);
      this.unlockAchievement('fashion_star');
      return hatId;
    },

    getEquippedPattern() {
      return getItem(KEYS.FASHION_PATTERN, 'pattern_smooth');
    },

    setEquippedPattern(patternId) {
      setItem(KEYS.FASHION_PATTERN, patternId);
      return patternId;
    },

    getUnlockedFashion() {
      return getItem(KEYS.FASHION_UNLOCKED, ['skin_green', 'hat_none', 'pattern_smooth']);
    },

    isFashionUnlocked(itemId) {
      const list = this.getUnlockedFashion();
      return list.includes(itemId);
    },

    unlockFashionItem(itemId) {
      const list = this.getUnlockedFashion();
      if (!list.includes(itemId)) {
        list.push(itemId);
        setItem(KEYS.FASHION_UNLOCKED, list);
        this.unlockAchievement('fashion_star');
        return true;
      }
      return false;
    },

    // ==========================================
    // Snake Evolution System (XP & Stages)
    // ==========================================
    getEvolutionExp() {
      return getItem(KEYS.EVOLUTION_EXP, 0);
    },

    addEvolutionExp(amount) {
      if (!amount || amount <= 0) return this.getEvolutionExp();
      const current = this.getEvolutionExp();
      const updated = current + Math.round(amount);
      setItem(KEYS.EVOLUTION_EXP, updated);
      if (updated >= 1500) {
        this.unlockAchievement('evolution_mega');
      }
      return updated;
    },

    // ==========================================
    // Calendar Date-Based Daily Login & Missions
    // ==========================================
    getDailyLogin() {
      return getItem(KEYS.DAILY_LOGIN, {
        lastDate: null,
        streak: 0,
        claimedDays: []
      });
    },

    recordDailyLogin() {
      const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const data = this.getDailyLogin();

      if (data.lastDate === today) {
        return { isNewDay: false, streak: data.streak, claimedDays: data.claimedDays };
      }

      // Check if yesterday was last login
      let streak = data.streak || 0;
      if (data.lastDate) {
        const last = new Date(data.lastDate);
        const curr = new Date(today);
        const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak = (streak % 7) + 1;
        } else {
          streak = 1; // Reset streak if missed day
        }
      } else {
        streak = 1;
      }

      data.lastDate = today;
      data.streak = streak;
      // If cycle resets or new day, keep track
      setItem(KEYS.DAILY_LOGIN, data);
      return { isNewDay: true, streak, claimedDays: data.claimedDays || [] };
    },

    claimDailyLoginReward(dayNum, coinReward) {
      const data = this.getDailyLogin();
      if (!data.claimedDays) data.claimedDays = [];
      const today = new Date().toISOString().slice(0, 10);
      const claimKey = `${today}_day${dayNum}`;
      if (!data.claimedDays.includes(claimKey)) {
        data.claimedDays.push(claimKey);
        setItem(KEYS.DAILY_LOGIN, data);
        this.addCoins(coinReward);
        return true;
      }
      return false;
    },

    getDailyMissions() {
      const today = new Date().toISOString().slice(0, 10);
      const saved = getItem(KEYS.DAILY_MISSIONS, null);
      if (saved && saved.date === today) {
        return saved;
      }
      // Generate fresh daily missions for today
      const freshMissions = {
        date: today,
        missions: [
          { id: 'eat_20', title: 'Fruit Feast', desc: 'Eat 20 fruits in any mode', target: 20, current: 0, reward: 50, claimed: false },
          { id: 'play_3', title: 'Daily Runner', desc: 'Play 3 games', target: 3, current: 0, reward: 60, claimed: false },
          { id: 'score_300', title: 'High Scorer', desc: 'Score 300 points in any run', target: 300, current: 0, reward: 80, claimed: false },
          { id: 'rescue_1', title: 'Little Hero', desc: 'Rescue 1 baby snake in Adventure World', target: 1, current: 0, reward: 100, claimed: false }
        ]
      };
      setItem(KEYS.DAILY_MISSIONS, freshMissions);
      return freshMissions;
    },

    saveDailyMissions(missionsData) {
      setItem(KEYS.DAILY_MISSIONS, missionsData);
      return missionsData;
    },

    updateDailyMissionProgress(missionId, amount = 1) {
      const data = this.getDailyMissions();
      let changed = false;
      data.missions.forEach(m => {
        if (m.id === missionId && !m.claimed) {
          m.current = Math.min(m.target, m.current + amount);
          changed = true;
        }
      });
      if (changed) {
        this.saveDailyMissions(data);
      }
      return data;
    },

    claimDailyMissionReward(missionId) {
      const data = this.getDailyMissions();
      const mission = data.missions.find(m => m.id === missionId);
      if (mission && mission.current >= mission.target && !mission.claimed) {
        mission.claimed = true;
        this.saveDailyMissions(data);
        this.addCoins(mission.reward);
        return mission.reward;
      }
      return 0;
    },

    // ==========================================
    // Ghost Rival Best Run Trail Recording
    // ==========================================
    getGhostRun(mode = 'classic') {
      const all = getItem(KEYS.GHOST_RUN, {});
      return all[mode] || null;
    },

    saveGhostRun(mode = 'classic', runData) {
      if (!runData || !runData.trail || runData.trail.length === 0) return;
      const all = getItem(KEYS.GHOST_RUN, {});
      const existing = all[mode];
      // Only replace if score is higher or equal
      if (!existing || runData.score >= existing.score) {
        all[mode] = {
          score: runData.score,
          trail: runData.trail.slice(0, 1500), // Cap to max 1500 steps to keep storage light
          date: Date.now()
        };
        setItem(KEYS.GHOST_RUN, all);
      }
    },

    // ==========================================
    // Claimed Achievements
    // ==========================================
    getClaimedAchievements() {
      return getItem(KEYS.CLAIMED_ACHIEVEMENTS, []);
    },

    claimAchievementReward(achievementId) {
      const claimed = this.getClaimedAchievements();
      if (!claimed.includes(achievementId)) {
        const def = DEFAULT_ACHIEVEMENTS.find(a => a.id === achievementId);
        if (def && this.getUnlockedAchievements().includes(achievementId)) {
          claimed.push(achievementId);
          setItem(KEYS.CLAIMED_ACHIEVEMENTS, claimed);
          this.addCoins(def.reward || 50);
          return def.reward || 50;
        }
      }
      return 0;
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
