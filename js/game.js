/**
 * NEON SNAKE - Core Game Controller & Loop
 * Integrates 4 Game Modes (Infinity, Classic, Time Attack, Obstacle),
 * Themes, Obstacles, Snake, Food, Web Audio, Particles, and UI states.
 */

const Game = (() => {
  // Game States
  const STATES = {
    MENU: 'menu',
    COUNTDOWN: 'countdown',
    PLAYING: 'playing',
    PAUSED: 'paused',
    LEVEL_TRANSITION: 'transition',
    GAMEOVER: 'gameover'
  };

  let currentState = STATES.MENU;

  // Canvas & Render Setup
  let canvas = null;
  let ctx = null;
  const GRID_SIZE = 25; // 25x25 grid
  let cellSize = 24;

  // Game Objects
  let snake = null;
  let foodManager = null;
  let particles = [];

  // Active Mode & Config
  let currentMode = null;
  let timeRemaining = 60; // For Time Attack
  let lastSecondTick = 60;
  let obstacleFoodCollected = 0;
  let obstacleLevelsCleared = 0;

  // Timing & Game Loop
  let lastFrameTime = 0;
  let tickAccumulator = 0;
  let totalElapsedPlayTime = 0; // in milliseconds
  let animationFrameId = null;

  // Scoring & Progression
  let score = 0;
  let level = 1;
  let foodEatenCount = 0;
  let difficulty = 'medium';

  // Base tick intervals (ms) by difficulty
  const BASE_SPEEDS = {
    easy: 135,
    medium: 95,
    hard: 68
  };

  // Particle Class for sparks & bursts
  class Particle {
    constructor(x, y, color, speed = 3, size = 3.5, life = 1.0) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const velocity = (Math.random() * 0.7 + 0.3) * speed;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity;
      this.size = Math.random() * size + 1.5;
      this.life = life;
      this.maxLife = life;
      this.decay = Math.random() * 0.02 + 0.015;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.96; // drag
      this.vy *= 0.96;
      this.life -= this.decay;
    }

    draw(context) {
      if (this.life <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.life / this.maxLife);
      context.shadowColor = this.color;
      context.shadowBlur = 8;
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
  }

  // Calculate current tick speed (ms per snake step)
  const getTickInterval = () => {
    const settings = Storage.getSettings();
    const speedModifier = settings.snakeSpeedModifier || 1.0;

    let base = BASE_SPEEDS[difficulty] || 95;
    if (currentMode && currentMode.id === 'timeAttack') {
      base = 90; // Fixed exhilarating speed in Time Attack
    }

    let speedUp = 0;
    if (!currentMode || currentMode.speedScaling !== false) {
      // Speed increases by ~3.5ms per level (cap at 45ms)
      speedUp = (level - 1) * 3.5;
    }

    let calculated = (base - speedUp) / speedModifier;

    // Power-Up speed multiplier (Speed Boost = 1.45x, Slow Motion = 0.6x)
    if (typeof PowerUpManager !== 'undefined') {
      calculated = calculated / PowerUpManager.getSpeedMultiplier();
    }

    return Math.max(38, calculated);
  };

  // Calculate speed multiplier for HUD display
  const getSpeedMultiplier = () => {
    const currentTick = getTickInterval();
    const baseMedium = BASE_SPEEDS.medium;
    return baseMedium / currentTick;
  };

  // Create particle burst at grid coordinate
  const spawnFoodParticles = (gridX, gridY, color, count = 20) => {
    const settings = Storage.getSettings();
    if (settings.showParticles === false) return;

    const px = gridX * cellSize + cellSize / 2;
    const py = gridY * cellSize + cellSize / 2;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(px, py, color, 4.5, 3.5, 1.0));
    }
  };

  // Create game over crash particle explosion
  const spawnCrashParticles = (segments) => {
    const settings = Storage.getSettings();
    if (settings.showParticles === false) return;

    const pal = Themes.getPalette();
    const colors = [pal.body, pal.food, '#ffffff', pal.scaleStroke];

    segments.slice(0, 10).forEach((seg) => {
      const px = seg.x * cellSize + cellSize / 2;
      const py = seg.y * cellSize + cellSize / 2;
      for (let i = 0; i < 5; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(px, py, color, 6.0, 4.0, 1.2));
      }
    });
  };

  // Initialize Canvas with proper device pixel ratio & dynamic viewport scaling
  const setupCanvas = () => {
    canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    const container = document.getElementById('game-board-container');
    if (container) {
      void container.offsetWidth; // Force layout reflow
    }
    const rect = container ? container.getBoundingClientRect() : null;
    let width = rect ? Math.floor(rect.width) : (container ? container.clientWidth : 0);
    let height = rect ? Math.floor(rect.height) : (container ? container.clientHeight : 0);

    // Fallback if dimensions are not yet available
    if (width <= 0) {
      width = Math.min(window.innerWidth - 24, Math.floor(window.innerHeight * 0.65), 760);
    }
    if (height <= 0) {
      height = width;
    }

    // Maintain 1:1 aspect ratio
    const squareSize = Math.floor(Math.min(width, height));
    width = Math.max(180, squareSize);
    height = width;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cellSize = width / GRID_SIZE;
  };

  // Draw cyber background grid
  const drawBackground = () => {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const pal = Themes.getPalette();
    const settings = Storage.getSettings();

    // Board background fill with Adventure World canvas palette support
    let bgFill = pal.boardBg || '#FFFDF8';
    if (currentMode && currentMode.isAdventure && typeof AdventureWorld !== 'undefined') {
      const world = AdventureWorld.getCurrentWorld();
      if (world && world.canvasBg) bgFill = world.canvasBg;
    }

    ctx.fillStyle = bgFill;
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid Lines
    if (settings.showGrid !== false) {
      ctx.strokeStyle = pal.gridLine || 'rgba(191, 165, 255, 0.12)';
      ctx.lineWidth = 1;

      for (let x = 0; x <= width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Outer soft border
    ctx.strokeStyle = pal.obstacleBorder ? `${pal.obstacleBorder}88` : 'rgba(191, 165, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
  };

  // Check achievements after gameplay events
  const checkAchievements = () => {
    // 1. First Food
    if (foodEatenCount >= 1) {
      const ach = Storage.unlockAchievement('first_food');
      if (ach) UI.showToast(ach);
    }

    // 2. Snake Master (100 points)
    if (score >= 100) {
      const ach = Storage.unlockAchievement('score_100');
      if (ach) UI.showToast(ach);
    }

    // 3. Speed Demon (150+ on HARD)
    if (difficulty === 'hard' && score >= 150) {
      const ach = Storage.unlockAchievement('speed_demon');
      if (ach) UI.showToast(ach);
    }

    // 4. Survivor (5 minutes = 300,000ms)
    if (totalElapsedPlayTime >= 300000) {
      const ach = Storage.unlockAchievement('survivor');
      if (ach) UI.showToast(ach);
    }

    // 5. Time Champion (200 in Time Attack)
    if (currentMode && currentMode.id === 'timeAttack' && score >= 200) {
      const ach = Storage.unlockAchievement('time_champion');
      if (ach) UI.showToast(ach);
    }

    // 6. Obstacle Explorer (10 obstacle levels)
    if (obstacleLevelsCleared >= 10) {
      const ach = Storage.unlockAchievement('obstacle_explorer');
      if (ach) UI.showToast(ach);
    }

    // 7. Infinity Legend (300 in Infinity Mode)
    if (currentMode && currentMode.id === 'infinity' && score >= 300) {
      const ach = Storage.unlockAchievement('infinity_legend');
      if (ach) UI.showToast(ach);
    }
  };

  // Main step update (snake movement & logic)
  const step = () => {
    if (currentState !== STATES.PLAYING) return;

    snake.move();

    // 1. Check Wall Collision (skipped if wrapWalls or Ghost Mode is active)
    if (snake.checkWallCollision()) {
      if (typeof PowerUpManager !== 'undefined' && PowerUpManager.hasGhostMode()) {
        // Ghost mode ignores wall impact
      } else if (typeof PowerUpManager !== 'undefined' && PowerUpManager.consumeShield()) {
        snake.setSurprised(800);
      } else {
        handleGameOver('wall');
        return;
      }
    }

    // 2. Check Self Collision
    if (snake.checkSelfCollision()) {
      if (typeof PowerUpManager !== 'undefined' && PowerUpManager.hasGhostMode()) {
        // Ghost mode ignores self collision
      } else if (typeof PowerUpManager !== 'undefined' && PowerUpManager.consumeShield()) {
        snake.setSurprised(800);
      } else {
        handleGameOver('self');
        return;
      }
    }

    const head = snake.segments[0];

    // 3. Check Obstacle Collision
    if (currentMode && currentMode.hasObstacles) {
      if (ObstaclesManager.checkCollision(head)) {
        if (typeof PowerUpManager !== 'undefined' && PowerUpManager.hasGhostMode()) {
          // Ghost mode passes through obstacle
        } else if (typeof PowerUpManager !== 'undefined' && PowerUpManager.consumeShield()) {
          snake.setSurprised(800);
        } else {
          handleGameOver('obstacle');
          return;
        }
      }
    }

    // 4. Check Power-Up Collision
    if (typeof PowerUpManager !== 'undefined') {
      const picked = PowerUpManager.checkCollision(head);
      if (picked) {
        snake.setSurprised(650);
        if (currentMode && currentMode.isAdventure && typeof AdventureWorld !== 'undefined') {
          AdventureWorld.recordPowerupCollected();
        }
      }
    }

    // 5. Baby Snake Rescue
    if (currentMode && currentMode.isAdventure && typeof AdventureWorld !== 'undefined') {
      AdventureWorld.onSnakeMove(head, snake.segments[snake.segments.length - 1]);
    }

    // 6. Record Ghost Rival step
    if (typeof GhostRival !== 'undefined') {
      GhostRival.recordStep(head.x, head.y, score, totalElapsedPlayTime);
    }

    // 7. Check Food Collision
    const eaten = foodManager.checkCollision(head);

    if (eaten) {
      snake.grow(1);
      score += eaten.points;
      foodEatenCount++;

      // Virtual coins & evolution XP & daily mission
      const coinMul = (typeof PowerUpManager !== 'undefined' && PowerUpManager.hasDoubleCoins()) ? 2 : 1;
      const coinsEarned = (eaten.type === 'bonus' ? 6 : 2) * coinMul;
      if (typeof Storage !== 'undefined') Storage.addCoins(coinsEarned);
      if (typeof SnakeEvolution !== 'undefined') SnakeEvolution.addExp(eaten.type === 'bonus' ? 5 : 2);
      if (typeof DailySystem !== 'undefined') DailySystem.recordEvent('food', 1);

      if (currentMode && currentMode.isAdventure && typeof AdventureWorld !== 'undefined') {
        AdventureWorld.recordFruitEaten();
      }

      const pal = Themes.getPalette();

      // Trigger SFX & Particles
      if (eaten.type === 'bonus') {
        SoundEngine.playBonusEat();
        spawnFoodParticles(eaten.x, eaten.y, pal.bonus || '#ffdd00', 30);
      } else {
        SoundEngine.playEat();
        spawnFoodParticles(eaten.x, eaten.y, pal.food || '#ff3366', 20);

        // Spawn next food with obstacle safety
        const obstacleCells = (currentMode && currentMode.hasObstacles) 
          ? ObstaclesManager.getObstacleCells() 
          : [];
        foodManager.spawnFood(snake.segments, obstacleCells, currentMode.bonusFrequency);
      }

      // Check level progression (every 50 points in non-obstacle modes)
      if (!currentMode || (!currentMode.hasObstacles && !currentMode.isAdventure)) {
        const newLevel = Math.floor(score / 50) + 1;
        if (newLevel > level) {
          level = newLevel;
          SoundEngine.playLevelUp();
        }
      }

      // Obstacle Mode Stage Clearance Check
      if (currentMode && currentMode.hasObstacles && !currentMode.isAdventure) {
        obstacleFoodCollected++;
        const target = currentMode.targetFoodPerLevel || 5;
        UI.updateObstacleProgress(obstacleFoodCollected, target);

        if (obstacleFoodCollected >= target) {
          handleObstacleLevelClear();
          return;
        }
      }

      // Adventure Mode Mission Completion Check
      if (currentMode && currentMode.isAdventure && typeof AdventureWorld !== 'undefined') {
        if (AdventureWorld.checkMissionStatus(score)) {
          handleAdventureLevelClear();
          return;
        }
      }

      // Update HUD
      UI.updateHUD(score, level, getSpeedMultiplier());

      // Save Best Score live
      const isNewBest = Storage.saveModeBestScore(currentMode.id, score);
      if (isNewBest) {
        UI.updateBestScoreDisplay();
      }

      checkAchievements();
    }
  };

  // Handle Level Cleared in Adventure World
  const handleAdventureLevelClear = () => {
    currentState = STATES.LEVEL_TRANSITION;
    SoundEngine.stopBGM();
    SoundEngine.playLevelClear();

    const mission = AdventureWorld.getCurrentMission();
    const stars = AdventureWorld.calculateStars(score);
    const coinsReward = mission ? mission.coinReward : 100;

    if (mission) {
      Storage.completeAdventureLevel(mission.worldId, mission.levelNum, stars, score, coinsReward);
    }
    if (typeof SnakeEvolution !== 'undefined') {
      SnakeEvolution.addExp(60);
    }
    if (typeof DailySystem !== 'undefined') {
      DailySystem.recordEvent('rescue', 1);
    }

    UI.showLevelVictory({
      worldName: mission ? mission.worldName : 'Adventure World',
      levelNum: mission ? mission.levelNum : 1,
      title: mission ? mission.title : 'Mission Accomplished',
      stars,
      score,
      coinsReward
    });
  };

  // Handle Level Cleared in Obstacle Mode
  const handleObstacleLevelClear = () => {
    currentState = STATES.LEVEL_TRANSITION;
    obstacleLevelsCleared++;
    SoundEngine.playLevelClear();
    score += 100; // Stage bonus
    UI.updateHUD(score, level, getSpeedMultiplier());

    const currentLvl = ObstaclesManager.getCurrentLevel();
    const maxLvl = ObstaclesManager.getMaxLevel();

    if (currentLvl >= maxLvl) {
      // Completed all 10 obstacle levels!
      const ach = Storage.unlockAchievement('obstacle_explorer');
      if (ach) UI.showToast(ach);
      setTimeout(() => {
        handleGameOver('victory');
      }, 500);
      return;
    }

    const nextLvl = currentLvl + 1;
    ObstaclesManager.setLevel(nextLvl);
    level = nextLvl;
    obstacleFoodCollected = 0;

    const nextData = ObstaclesManager.getLevelData();
    UI.showLevelClear(currentLvl, nextData.name, () => {
      // Reset snake and continue next stage
      snake.reset();
      foodManager.reset();
      foodManager.spawnFood(snake.segments, ObstaclesManager.getObstacleCells(), currentMode.bonusFrequency);
      UI.updateObstacleProgress(0, currentMode.targetFoodPerLevel || 5);
      currentState = STATES.PLAYING;
    });
  };

  // Handle Game Over
  const handleGameOver = (cause) => {
    currentState = STATES.GAMEOVER;
    SoundEngine.stopBGM();
    SoundEngine.playGameOver();

    // Spawn explosion particles
    spawnCrashParticles(snake.segments);

    // End ghost rival recording
    if (typeof GhostRival !== 'undefined') {
      GhostRival.endRun(currentMode.id, score);
    }
    if (typeof DailySystem !== 'undefined') {
      DailySystem.recordEvent('score', score);
    }

    // Save to Multi-Mode Analytics & Leaderboard
    const isNewRecord = Storage.saveModeBestScore(currentMode.id, score);
    Storage.recordGameStats({
      mode: currentMode.id,
      score,
      foodCount: foodEatenCount,
      playtimeSec: totalElapsedPlayTime / 1000,
      obstacleLevelsCleared
    });
    Storage.addLeaderboardEntry(score, level, difficulty, currentMode.id);
    UI.updateBestScoreDisplay();

    // Format time survived
    const totalSecs = Math.floor(totalElapsedPlayTime / 1000);
    const mins = String(Math.floor(totalSecs / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');

    // Show Game Over Overlay with stats & active mode badge
    setTimeout(() => {
      UI.showGameOver({
        mode: currentMode.name,
        modeId: currentMode.id,
        score,
        bestScore: Storage.getModeBestScore(currentMode.id),
        foodEaten: foodEatenCount,
        timeString: `${mins}:${secs}`,
        cause
      }, isNewRecord);
    }, 450);
  };

  // Main animation / render loop
  const gameLoop = (timestamp) => {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const deltaTime = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    let moveProgress = 1;

    if (currentState === STATES.PLAYING) {
      totalElapsedPlayTime += deltaTime;
      tickAccumulator += deltaTime;

      // Handle Time Attack live countdown timer
      if (currentMode && currentMode.hasTimer) {
        timeRemaining -= deltaTime / 1000;
        const currentIntSec = Math.ceil(timeRemaining);

        if (currentIntSec !== lastSecondTick) {
          lastSecondTick = currentIntSec;
          if (currentIntSec <= 10 && currentIntSec > 0) {
            SoundEngine.playTimeTick(currentIntSec <= 5);
          }
        }

        UI.updateTimer(Math.max(0, timeRemaining));

        if (timeRemaining <= 0) {
          handleGameOver('timeout');
          return;
        }
      }

      const tickInterval = getTickInterval();
      while (tickAccumulator >= tickInterval) {
        step();
        tickAccumulator -= tickInterval;
      }

      // Smooth fractional progress (0.0 to 1.0) between ticks for 60 FPS interpolation
      moveProgress = Math.min(1, Math.max(0, tickAccumulator / tickInterval));

      // Update Food Manager (bonus timers)
      foodManager.update(deltaTime);
      if (foodManager.bonusFood) {
        UI.updateBonusBar(foodManager.bonusFood.remaining, foodManager.bonusFood.maxTime);
      } else {
        UI.updateBonusBar(0, 1);
      }

      // Update Power-Ups
      if (typeof PowerUpManager !== 'undefined') {
        const head = snake.segments[0];
        const obstacleCells = (currentMode && currentMode.hasObstacles) ? ObstaclesManager.getObstacleCells() : [];
        PowerUpManager.update(deltaTime, head, foodManager, snake.segments, obstacleCells, GRID_SIZE, GRID_SIZE);
        if (UI.updatePowerUpBar) {
          UI.updatePowerUpBar(PowerUpManager.getActiveEffects());
        }
      }

      // Update Ghost Rival
      if (typeof GhostRival !== 'undefined') {
        GhostRival.update(totalElapsedPlayTime, score);
        if (UI.updateGhostDelta) {
          UI.updateGhostDelta(GhostRival.getScoreDelta());
        }
      }

      // Update Weather Atmosphere
      if (typeof WeatherEngine !== 'undefined') {
        WeatherEngine.update(deltaTime, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      }

      // Update Adventure World Survival timer & mission tracking
      if (currentMode && currentMode.isAdventure && typeof AdventureWorld !== 'undefined') {
        AdventureWorld.updateSurvivalTime(totalElapsedPlayTime / 1000);
        if (UI.updateAdventureMissionHUD) {
          UI.updateAdventureMissionHUD(AdventureWorld.getMissionProgressText(), AdventureWorld.getMissionProgressPercent());
        }
        if (AdventureWorld.checkMissionStatus(score)) {
          handleAdventureLevelClear();
          return;
        }
      }

      // Periodic check for survival achievements
      checkAchievements();
    }

    // Render Scene
    drawBackground();

    const renderW = canvas.width / (window.devicePixelRatio || 1);
    const renderH = canvas.height / (window.devicePixelRatio || 1);

    // Dynamic Weather Atmosphere Particles
    if (typeof WeatherEngine !== 'undefined') {
      WeatherEngine.draw(ctx, renderW, renderH);
    }

    // Adventure Safe Zone Nest & Baby Snakes
    if (typeof AdventureWorld !== 'undefined' && currentMode && currentMode.isAdventure) {
      AdventureWorld.draw(ctx, cellSize);
    }

    // Ghost Rival Phantom Snake
    if (typeof GhostRival !== 'undefined') {
      GhostRival.draw(ctx, cellSize);
    }

    // Draw Obstacles (if Obstacle mode)
    if (currentMode && currentMode.hasObstacles) {
      ObstaclesManager.draw(ctx, cellSize, Themes.getPalette());
    }

    // Draw Collectible Power-Up Item on Grid
    if (typeof PowerUpManager !== 'undefined') {
      PowerUpManager.draw(ctx, cellSize);
    }

    // Draw Entities
    if (foodManager) foodManager.draw(ctx, cellSize);
    if (snake) snake.draw(ctx, cellSize, moveProgress);

    // Update & Draw Particles (runs at 60fps)
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) particles.splice(i, 1);
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  };

  // Auto-pause when tab/screen is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && currentState === STATES.PLAYING) {
      Game.pause();
    }
  });

  // Input Handling (Keyboard)
  const setupKeyboard = () => {
    window.addEventListener('keydown', (e) => {
      // Prevent browser scroll for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space', 'KeyR'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space') {
        if (currentState === STATES.PLAYING) {
          Game.pause();
        } else if (currentState === STATES.PAUSED) {
          Game.resume();
        }
        return;
      }

      if (e.code === 'KeyR') {
        if (currentState === STATES.PLAYING || currentState === STATES.PAUSED || currentState === STATES.GAMEOVER) {
          Game.restart();
        }
        return;
      }

      if (e.code === 'KeyM') {
        const settings = Storage.getSettings();
        const nextState = !settings.soundEnabled;
        Storage.saveSettings({ soundEnabled: nextState });
        SoundEngine.setSoundEnabled(nextState);
        UI.updateSoundToggles();
        return;
      }

      if (currentState !== STATES.PLAYING) return;

      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          snake.setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 'KeyS':
          snake.setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'KeyA':
          snake.setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'KeyD':
          snake.setDirection({ x: 1, y: 0 });
          break;
      }
    });
  };

  // Touch Swipe Gesture Detection on Canvas
  const setupTouchGestures = () => {
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
      if (currentState !== STATES.PLAYING) return;
      if (!e.changedTouches || e.changedTouches.length === 0) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const minSwipeDistance = 22;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) snake.setDirection({ x: 1, y: 0 });
          else snake.setDirection({ x: -1, y: 0 });
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) snake.setDirection({ x: 0, y: 1 });
          else snake.setDirection({ x: 0, y: -1 });
        }
      }
    }, { passive: true });
  };

  return {
    init() {
      Themes.init();
      GameModes.init();
      Storage.getSettings();
      SoundEngine.init();
      UI.init();

      setupCanvas();
      setupKeyboard();
      setupTouchGestures();

      snake = new Snake(GRID_SIZE, GRID_SIZE);
      foodManager = new FoodManager(GRID_SIZE, GRID_SIZE);

      this.bindUIButtons();

      // Start animation loop
      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(gameLoop);
    },

    bindUIButtons() {
      // Home screen play button
      document.getElementById('btn-play-game').addEventListener('click', () => {
        SoundEngine.playClick();
        this.startNewGame();
      });

      // HUD Pause button
      document.getElementById('btn-hud-pause').addEventListener('click', () => {
        SoundEngine.playClick();
        if (currentState === STATES.PLAYING) this.pause();
        else if (currentState === STATES.PAUSED) this.resume();
      });

      // HUD Restart button
      document.getElementById('btn-hud-restart').addEventListener('click', () => {
        SoundEngine.playClick();
        this.restart();
      });

      // Pause overlay buttons
      document.getElementById('btn-resume').addEventListener('click', () => {
        SoundEngine.playClick();
        this.resume();
      });

      document.getElementById('btn-pause-restart').addEventListener('click', () => {
        SoundEngine.playClick();
        this.restart();
      });

      document.getElementById('btn-pause-quit').addEventListener('click', () => {
        SoundEngine.playClick();
        this.quitToMenu();
      });

      // Game Over overlay buttons
      document.getElementById('btn-play-again').addEventListener('click', () => {
        SoundEngine.playClick();
        this.restart();
      });

      document.getElementById('btn-gameover-modes').addEventListener('click', () => {
        SoundEngine.playClick();
        this.quitToMenu();
        UI.openModesModal();
      });

      document.getElementById('btn-gameover-home').addEventListener('click', () => {
        SoundEngine.playClick();
        this.quitToMenu();
      });
    },

    handleDirection(dir) {
      if (currentState === STATES.PLAYING && snake) {
        snake.setDirection(dir);
      }
    },

    handleResize() {
      setupCanvas();
    },

    startNewGame(options = {}) {
      if (options.mode) {
        GameModes.setMode(options.mode);
      }
      currentMode = GameModes.getCurrentMode();
      difficulty = UI.getSelectedDifficulty();
      score = 0;
      level = 1;
      foodEatenCount = 0;
      totalElapsedPlayTime = 0;
      tickAccumulator = 0;
      particles = [];
      obstacleFoodCollected = 0;
      obstacleLevelsCleared = 0;

      // Mode-specific initialization
      if (currentMode.hasTimer) {
        timeRemaining = currentMode.timerSeconds || 60;
        lastSecondTick = Math.ceil(timeRemaining);
      } else {
        timeRemaining = 0;
      }

      if (currentMode.isAdventure && typeof AdventureWorld !== 'undefined') {
        const worldId = options.worldId || AdventureWorld.getCurrentWorldId() || 'forest';
        const levelNum = options.levelNum || AdventureWorld.getCurrentLevelNum() || 1;
        AdventureWorld.setLevel(worldId, levelNum);
        level = levelNum;
      } else if (currentMode.hasObstacles) {
        ObstaclesManager.setLevel(1);
      }

      snake.reset();
      snake.setWrapWalls(currentMode.wrapWalls);

      foodManager.reset();
      const obstacleCells = (currentMode.hasObstacles && !currentMode.isAdventure) 
        ? ObstaclesManager.getObstacleCells() 
        : [];
      foodManager.spawnFood(snake.segments, obstacleCells, currentMode.bonusFrequency);

      if (currentMode.isAdventure && typeof AdventureWorld !== 'undefined') {
        AdventureWorld.setupRescueMission(GRID_SIZE, GRID_SIZE, snake.segments, obstacleCells);
      }

      // Initialize Power-Ups, Ghost Rival, Weather & Daily tracking
      if (typeof PowerUpManager !== 'undefined') PowerUpManager.reset();
      if (typeof GhostRival !== 'undefined') GhostRival.startRun(currentMode.id);
      if (typeof WeatherEngine !== 'undefined') {
        const env = (currentMode.isAdventure && typeof AdventureWorld !== 'undefined')
          ? AdventureWorld.getCurrentWorld().weather
          : 'classic';
        WeatherEngine.init(env);
      }
      if (typeof DailySystem !== 'undefined') DailySystem.recordEvent('game', 1);

      UI.setupHUDForMode(currentMode);
      UI.updateHUD(score, level, getSpeedMultiplier());
      UI.updateBonusBar(0, 1);
      UI.hideGameOver();
      UI.showPause(false);
      UI.hideLevelClear();
      UI.showScreen('game');

      setupCanvas();

      currentState = STATES.COUNTDOWN;
      UI.showCountdown(3, () => {
        currentState = STATES.PLAYING;
        SoundEngine.startBGM();
      });
    },

    pause() {
      if (currentState !== STATES.PLAYING) return;
      currentState = STATES.PAUSED;
      SoundEngine.stopBGM();
      UI.showPause(true);
    },

    resume() {
      if (currentState !== STATES.PAUSED) return;
      UI.showPause(false);
      currentState = STATES.PLAYING;
      lastFrameTime = performance.now();
      SoundEngine.startBGM();
    },

    restart() {
      SoundEngine.stopBGM();
      UI.hideGameOver();
      UI.showPause(false);
      UI.hideLevelClear();
      this.startNewGame();
    },

    quitToMenu() {
      SoundEngine.stopBGM();
      currentState = STATES.MENU;
      UI.hideGameOver();
      UI.showPause(false);
      UI.hideLevelClear();
      UI.showScreen('home');
    }
  };
})();

// Initialize safely whether DOM is currently loading or already loaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    Game.init();
  });
} else {
  Game.init();
}
