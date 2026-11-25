/**
 * NEON SNAKE - Adventure World & Mission Progression System
 * Manages:
 * 1. 4 Playable Worlds: Forest, Candy, Ice, Desert
 * 2. 20 Adventure Levels with unique missions and objectives
 * 3. Baby Snake Rescue gameplay (spawning, following, safe zone nest delivery)
 * 4. Mission tracking, star rating computation, and reward distribution
 */

const AdventureWorld = (() => {
  const WORLDS = {
    forest: {
      id: 'forest',
      name: 'Forest World',
      badge: 'WORLD 1',
      tagline: 'Lush green woodlands with sweet berries & lost baby snakes!',
      bgColor: '#F0FDF4',
      canvasBg: '#DCFCE7',
      primaryColor: '#16A34A',
      accentColor: '#86EFAC',
      weather: 'forest',
      foodName: 'Forest Berry',
      foodColor: '#EF4444',
      obstaclesType: 'forest',
      unlockStars: 0
    },
    candy: {
      id: 'candy',
      name: 'Candy World',
      badge: 'WORLD 2',
      tagline: 'Sweet pastel sugary paradise of swirl lollipops & candy canes!',
      bgColor: '#FDF2F8',
      canvasBg: '#FCE7F3',
      primaryColor: '#DB2777',
      accentColor: '#F472B6',
      weather: 'candy',
      foodName: 'Swirl Lollipop',
      foodColor: '#EC4899',
      obstaclesType: 'candy',
      unlockStars: 8
    },
    ice: {
      id: 'ice',
      name: 'Ice World',
      badge: 'WORLD 3',
      tagline: 'Chilly snowy wonderland with frozen crystals & ice pillars!',
      bgColor: '#F0F9FF',
      canvasBg: '#E0F2FE',
      primaryColor: '#0284C7',
      accentColor: '#38BDF8',
      weather: 'ice',
      foodName: 'Ice Crystal',
      foodColor: '#06B6D4',
      obstaclesType: 'ice',
      unlockStars: 18
    },
    desert: {
      id: 'desert',
      name: 'Desert World',
      badge: 'WORLD 4',
      tagline: 'Golden dunes, hidden ancient ruins & sunny prickly fruits!',
      bgColor: '#FFFBEB',
      canvasBg: '#FEF3C7',
      primaryColor: '#D97706',
      accentColor: '#FBBF24',
      weather: 'desert',
      foodName: 'Golden Date',
      foodColor: '#F59E0B',
      obstaclesType: 'desert',
      unlockStars: 30
    }
  };

  // 5 Levels per world
  const LEVEL_TEMPLATES = [
    {
      levelNum: 1,
      title: 'Fruit Feast',
      type: 'collect_fruit',
      target: 10,
      hasObstacles: false,
      hasBabyRescue: false,
      desc: 'Collect 10 juicy fruits!',
      coinReward: 80
    },
    {
      levelNum: 2,
      title: 'Tricky Maze',
      type: 'collect_fruit',
      target: 12,
      hasObstacles: true,
      obstacleCount: 6,
      hasBabyRescue: false,
      desc: 'Collect 12 fruits while dodging obstacles!',
      coinReward: 100
    },
    {
      levelNum: 3,
      title: 'Power Frenzy',
      type: 'collect_powerups',
      target: 3,
      secondaryTarget: 10, // Also eat 10 fruits
      hasObstacles: true,
      obstacleCount: 8,
      hasBabyRescue: false,
      desc: 'Collect 3 power-ups & 10 fruits!',
      coinReward: 120
    },
    {
      levelNum: 4,
      title: 'Baby Snake Rescue',
      type: 'rescue_babies',
      target: 2, // Rescue 2 baby snakes
      hasObstacles: true,
      obstacleCount: 8,
      hasBabyRescue: true,
      desc: 'Rescue 2 baby snakes and bring them to the Safe Zone nest!',
      coinReward: 160
    },
    {
      levelNum: 5,
      title: 'World Master',
      type: 'survive_score',
      target: 60, // 60 seconds survival
      scoreTarget: 200,
      hasObstacles: true,
      obstacleCount: 10,
      hasBabyRescue: true,
      desc: 'Survive 60 seconds with 200+ score!',
      coinReward: 200
    }
  ];

  // Active state during gameplay
  let currentWorldId = 'forest';
  let currentLevelNum = 1;
  let currentMission = null;

  // Mission progress counters
  let fruitProgress = 0;
  let powerupProgress = 0;
  let babyRescueProgress = 0;
  let survivalSeconds = 0;
  let missionComplete = false;

  // Baby Snake Rescue System State
  let babySnakes = []; // [ { x, y, isFollowing: false, isDelivered: false } ]
  let safeZone = null; // { x, y, width, height }
  let babyAnimPhase = 0;

  return {
    init() {
      const progress = (typeof Storage !== 'undefined') ? Storage.getAdventureProgress() : null;
      if (progress) {
        currentWorldId = progress.currentWorld || 'forest';
        currentLevelNum = progress.currentLevel || 1;
      }
    },

    getWorlds() {
      return Object.values(WORLDS);
    },

    getWorld(id) {
      return WORLDS[id] || WORLDS.forest;
    },

    getCurrentWorldId() {
      return currentWorldId;
    },

    getCurrentWorld() {
      return this.getWorld(currentWorldId);
    },

    getCurrentLevelNum() {
      return currentLevelNum;
    },

    getCurrentMission() {
      return currentMission;
    },

    isWorldUnlocked(worldId) {
      if (worldId === 'forest') return true;
      if (typeof Storage === 'undefined') return false;
      const progress = Storage.getAdventureProgress();
      return progress.unlockedWorlds && progress.unlockedWorlds.includes(worldId);
    },

    setLevel(worldId, levelNum) {
      if (WORLDS[worldId]) currentWorldId = worldId;
      currentLevelNum = Math.max(1, Math.min(5, levelNum || 1));

      const template = LEVEL_TEMPLATES[currentLevelNum - 1] || LEVEL_TEMPLATES[0];
      const world = this.getWorld(currentWorldId);

      currentMission = {
        ...template,
        worldId: currentWorldId,
        worldName: world.name,
        fullTitle: `${world.name} - Level ${currentLevelNum}: ${template.title}`
      };

      // Reset mission counters
      fruitProgress = 0;
      powerupProgress = 0;
      babyRescueProgress = 0;
      survivalSeconds = 0;
      missionComplete = false;
      babySnakes = [];
      safeZone = null;

      // Update Weather for the world
      if (typeof WeatherEngine !== 'undefined') {
        WeatherEngine.setEnvironment(world.weather);
      }

      return currentMission;
    },

    // Setup Safe Zone and Baby Snakes on the map
    setupRescueMission(gridCols = 24, gridRows = 24, snakeSegments = [], obstacleCells = []) {
      if (!currentMission || !currentMission.hasBabyRescue) {
        babySnakes = [];
        safeZone = null;
        return;
      }

      // 1. Safe Zone Nest in top-left or top-right corner
      safeZone = {
        x: gridCols - 4,
        y: 2,
        width: 3,
        height: 3
      };

      const occupied = new Set();
      snakeSegments.forEach(s => occupied.add(`${s.x},${s.y}`));
      obstacleCells.forEach(c => occupied.add(`${c.x},${c.y}`));
      for (let x = safeZone.x; x < safeZone.x + safeZone.width; x++) {
        for (let y = safeZone.y; y < safeZone.y + safeZone.height; y++) {
          occupied.add(`${x},${y}`);
        }
      }

      // 2. Spawn 1st baby snake
      const free = [];
      for (let x = 3; x < gridCols - 3; x++) {
        for (let y = 3; y < gridRows - 3; y++) {
          if (!occupied.has(`${x},${y}`)) {
            free.push({ x, y });
          }
        }
      }

      babySnakes = [];
      if (free.length > 0) {
        const pt = free[Math.floor(Math.random() * free.length)];
        babySnakes.push({
          x: pt.x,
          y: pt.y,
          isFollowing: false,
          isDelivered: false
        });
      }
    },

    // Called on snake move to handle baby rescue collision & safe zone delivery
    onSnakeMove(head, snakeTail) {
      if (!safeZone || babySnakes.length === 0) return;

      babySnakes.forEach(b => {
        if (!b.isFollowing && !b.isDelivered) {
          // Contact with snake head rescues the baby snake!
          if (head.x === b.x && head.y === b.y) {
            b.isFollowing = true;
            if (typeof SoundEngine !== 'undefined') {
              SoundEngine.playRescue();
            }
            if (typeof UI !== 'undefined' && UI.showToast) {
              UI.showToast('Baby snake rescued! Guide it to the Safe Zone nest!', 'success');
            }
          }
        } else if (b.isFollowing && !b.isDelivered) {
          // Baby hops along following the tail
          if (snakeTail) {
            b.x = snakeTail.x;
            b.y = snakeTail.y;
          }

          // Check if snake head or tail has entered the Safe Zone nest!
          const inSafeZone = (
            (head.x >= safeZone.x && head.x < safeZone.x + safeZone.width &&
             head.y >= safeZone.y && head.y < safeZone.y + safeZone.height) ||
            (b.x >= safeZone.x && b.x < safeZone.x + safeZone.width &&
             b.y >= safeZone.y && b.y < safeZone.y + safeZone.height)
          );

          if (inSafeZone) {
            b.isFollowing = false;
            b.isDelivered = true;
            babyRescueProgress++;

            if (typeof SoundEngine !== 'undefined') {
              SoundEngine.playLevelUp();
            }

            if (typeof Storage !== 'undefined') {
              Storage.recordAdventureStats({ babyRescued: 1, coins: 50 });
              Storage.addCoins(50);
            }

            if (typeof UI !== 'undefined' && UI.showToast) {
              UI.showToast('Baby safely nestled! +50 Coins!', 'bonus');
            }

            // Spawn another baby snake if mission target not yet reached
            if (babyRescueProgress < currentMission.target) {
              this.spawnNextBaby(24, 24);
            }

            this.checkMissionStatus();
          }
        }
      });
    },

    spawnNextBaby(gridCols, gridRows) {
      const free = [];
      for (let x = 3; x < gridCols - 3; x++) {
        for (let y = 3; y < gridRows - 3; y++) {
          if (!safeZone || !(x >= safeZone.x && x < safeZone.x + safeZone.width && y >= safeZone.y && y < safeZone.y + safeZone.height)) {
            free.push({ x, y });
          }
        }
      }
      if (free.length > 0) {
        const pt = free[Math.floor(Math.random() * free.length)];
        babySnakes.push({
          x: pt.x,
          y: pt.y,
          isFollowing: false,
          isDelivered: false
        });
      }
    },

    // Record events for mission progression
    recordFruitEaten() {
      fruitProgress++;
      this.checkMissionStatus();
    },

    recordPowerupCollected() {
      powerupProgress++;
      this.checkMissionStatus();
    },

    updateSurvivalTime(elapsedSec) {
      survivalSeconds = Math.floor(elapsedSec);
      this.checkMissionStatus();
    },

    checkMissionStatus(currentScore = 0) {
      if (!currentMission || missionComplete) return false;

      let isDone = false;

      if (currentMission.type === 'collect_fruit') {
        isDone = fruitProgress >= currentMission.target;
      } else if (currentMission.type === 'collect_powerups') {
        isDone = powerupProgress >= currentMission.target && fruitProgress >= currentMission.secondaryTarget;
      } else if (currentMission.type === 'rescue_babies') {
        isDone = babyRescueProgress >= currentMission.target;
      } else if (currentMission.type === 'survive_score') {
        isDone = survivalSeconds >= currentMission.target && currentScore >= currentMission.scoreTarget;
      }

      if (isDone) {
        missionComplete = true;
      }
      return isDone;
    },

    isMissionComplete() {
      return missionComplete;
    },

    getMissionProgressText() {
      if (!currentMission) return '';
      if (currentMission.type === 'collect_fruit') {
        return `Fruits: ${fruitProgress}/${currentMission.target}`;
      } else if (currentMission.type === 'collect_powerups') {
        return `Power-Ups: ${powerupProgress}/${currentMission.target} • Fruits: ${fruitProgress}/${currentMission.secondaryTarget}`;
      } else if (currentMission.type === 'rescue_babies') {
        return `Babies Rescued: ${babyRescueProgress}/${currentMission.target}`;
      } else if (currentMission.type === 'survive_score') {
        return `Survive: ${survivalSeconds}s/${currentMission.target}s`;
      }
      return '';
    },

    getMissionProgressPercent() {
      if (!currentMission) return 0;
      if (currentMission.type === 'collect_fruit') {
        return Math.min(100, (fruitProgress / currentMission.target) * 100);
      } else if (currentMission.type === 'collect_powerups') {
        const p1 = (powerupProgress / currentMission.target) * 50;
        const p2 = (fruitProgress / currentMission.secondaryTarget) * 50;
        return Math.min(100, p1 + p2);
      } else if (currentMission.type === 'rescue_babies') {
        return Math.min(100, (babyRescueProgress / currentMission.target) * 100);
      } else if (currentMission.type === 'survive_score') {
        return Math.min(100, (survivalSeconds / currentMission.target) * 100);
      }
      return 0;
    },

    // Calculate earned stars (1 to 3) based on score and time
    calculateStars(score = 0) {
      if (!missionComplete) return 0;
      if (score > 350) return 3;
      if (score > 180) return 2;
      return 1;
    },

    // Render Safe Zone Nest and Baby Snakes on canvas
    draw(ctx, cellSize) {
      babyAnimPhase += 0.05;
      const half = cellSize / 2;

      // 1. Draw Safe Zone Nest
      if (safeZone) {
        ctx.save();
        const sx = safeZone.x * cellSize;
        const sy = safeZone.y * cellSize;
        const sw = safeZone.width * cellSize;
        const sh = safeZone.height * cellSize;

        // Soft glowing lawn/nest patch
        ctx.fillStyle = 'rgba(74, 222, 128, 0.22)';
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(sx, sy, sw, sh, 14);
        } else {
          ctx.rect(sx, sy, sw, sh);
        }
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);

        // Cozy straw nest circle in center
        const ncx = sx + sw / 2;
        const ncy = sy + sh / 2;
        ctx.fillStyle = '#FEF08A';
        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(ncx, ncy, sw * 0.38, sh * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pulsing Heart / Safe Flag
        ctx.fillStyle = '#EF4444';
        const heartSize = cellSize * 0.35 + Math.sin(babyAnimPhase * 2) * (cellSize * 0.04);
        ctx.beginPath();
        ctx.arc(ncx - heartSize * 0.35, ncy - heartSize * 0.2, heartSize * 0.35, Math.PI, 0, false);
        ctx.arc(ncx + heartSize * 0.35, ncy - heartSize * 0.2, heartSize * 0.35, Math.PI, 0, false);
        ctx.lineTo(ncx, ncy + heartSize * 0.45);
        ctx.closePath();
        ctx.fill();

        // Label: "SAFE NEST"
        ctx.fillStyle = '#15803D';
        ctx.font = 'bold 9px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SAFE NEST', ncx, sy + sh - 4);

        ctx.restore();
      }

      // 2. Draw Baby Snakes
      babySnakes.forEach(b => {
        if (b.isDelivered) return;

        const bx = b.x * cellSize + half;
        const by = b.y * cellSize + half + Math.sin(babyAnimPhase * 3) * (cellSize * 0.05);
        const radius = cellSize * 0.32;

        ctx.save();

        // Soft ambient shadow
        ctx.fillStyle = 'rgba(48, 45, 53, 0.14)';
        ctx.beginPath();
        ctx.ellipse(bx, b.y * cellSize + cellSize * 0.82, radius * 0.85, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cute wiggling baby tail
        const tailWag = Math.sin(babyAnimPhase * 4) * (cellSize * 0.12);
        ctx.strokeStyle = '#4ECB23';
        ctx.lineWidth = radius * 0.7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bx - radius * 0.5, by + radius * 0.2);
        ctx.quadraticCurveTo(bx - radius * 0.9, by + radius * 0.5, bx - radius * 1.1 + tailWag, by + radius * 0.7);
        ctx.stroke();

        // Chubby Baby Body sphere
        const grad = ctx.createRadialGradient(
          bx - radius * 0.25, by - radius * 0.25, radius * 0.1,
          bx, by, radius
        );
        grad.addColorStop(0, '#86EFAC');
        grad.addColorStop(0.5, '#4ADE80');
        grad.addColorStop(1, '#16A34A');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, radius, 0, Math.PI * 2);
        ctx.fill();

        // Light yellow baby tummy
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.ellipse(bx, by + radius * 0.25, radius * 0.65, radius * 0.4, 0, 0, Math.PI);
        ctx.fill();

        // Rosy pink cheeks
        ctx.fillStyle = '#FB7185';
        ctx.beginPath();
        ctx.arc(bx - radius * 0.55, by + radius * 0.1, radius * 0.2, 0, Math.PI * 2);
        ctx.arc(bx + radius * 0.55, by + radius * 0.1, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Big sparkling cartoon eyes
        const eyeX = radius * 0.32;
        const eyeY = -radius * 0.15;
        [-1, 1].forEach(side => {
          ctx.fillStyle = '#1E1B24';
          ctx.beginPath();
          ctx.arc(bx + eyeX * side, by + eyeY, radius * 0.32, 0, Math.PI * 2);
          ctx.fill();

          // Catchlight shine
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(bx + eyeX * side - 1, by + eyeY - 1, radius * 0.12, 0, Math.PI * 2);
          ctx.fill();
        });

        // Cute baby pacifier or smile
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.ellipse(bx, by + radius * 0.32, radius * 0.24, radius * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rescue exclamation bubble if waiting for pickup
        if (!b.isFollowing) {
          ctx.fillStyle = '#FBBF24';
          ctx.beginPath();
          ctx.arc(bx, by - radius * 1.3, cellSize * 0.18, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#78350F';
          ctx.font = 'bold 8px Outfit, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('!', bx, by - radius * 1.3 + 3);
        }

        ctx.restore();
      });
    }
  };
})();
