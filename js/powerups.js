/**
 * NEON SNAKE - Adventure Power-Up System
 * Implements 6 collectible cartoon arcade power-ups:
 * 1. Shield (Protects against 1 collision)
 * 2. Speed Boost (Temporary turbo burst)
 * 3. Slow Motion (Time slows for easy maneuvering)
 * 4. Food Magnet (Draws nearby fruit toward snake head)
 * 5. Double Coins (2x virtual coin multiplier)
 * 6. Ghost Mode (Pass through walls and obstacles safely)
 */

const PowerUpManager = (() => {
  const POWERUP_DEFS = {
    shield: {
      id: 'shield',
      name: 'Shield',
      color: '#38BDF8',
      glow: 'rgba(56, 189, 248, 0.45)',
      duration: 18000,
      desc: 'Protects from 1 collision!',
      iconBg: '#E0F2FE'
    },
    speedBoost: {
      id: 'speedBoost',
      name: 'Speed Boost',
      color: '#F59E0B',
      glow: 'rgba(245, 158, 11, 0.45)',
      duration: 8000,
      desc: 'Turbo slither burst!',
      iconBg: '#FEF3C7'
    },
    slowMotion: {
      id: 'slowMotion',
      name: 'Slow Motion',
      color: '#818CF8',
      glow: 'rgba(129, 140, 248, 0.45)',
      duration: 8000,
      desc: 'Time slows down!',
      iconBg: '#EEF2FF'
    },
    magnet: {
      id: 'magnet',
      name: 'Food Magnet',
      color: '#EC4899',
      glow: 'rgba(236, 72, 153, 0.45)',
      duration: 10000,
      desc: 'Draws food to your head!',
      iconBg: '#FCE7F3'
    },
    doubleCoins: {
      id: 'doubleCoins',
      name: '2X Coins',
      color: '#EAB308',
      glow: 'rgba(234, 179, 8, 0.45)',
      duration: 12000,
      desc: 'Double coin rewards!',
      iconBg: '#FEF9C3'
    },
    ghostMode: {
      id: 'ghostMode',
      name: 'Ghost Mode',
      color: '#A855F7',
      glow: 'rgba(168, 85, 247, 0.45)',
      duration: 7000,
      desc: 'Pass through obstacles!',
      iconBg: '#F3E8FF'
    }
  };

  let spawned = null; // { x, y, type, remaining }
  let activeEffects = {}; // { type: { remaining, duration } }
  let animTime = 0;
  let spawnCooldown = 12000; // ms between spawns

  return {
    init() {
      this.reset();
    },

    reset() {
      spawned = null;
      activeEffects = {};
      animTime = 0;
      spawnCooldown = 10000;
    },

    getDefinitions() {
      return POWERUP_DEFS;
    },

    getActiveEffects() {
      return activeEffects;
    },

    hasEffect(type) {
      return !!activeEffects[type];
    },

    hasShield() {
      return !!activeEffects.shield;
    },

    hasGhostMode() {
      return !!activeEffects.ghostMode;
    },

    hasDoubleCoins() {
      return !!activeEffects.doubleCoins;
    },

    hasMagnet() {
      return !!activeEffects.magnet;
    },

    getSpeedMultiplier() {
      if (activeEffects.speedBoost) return 1.45;
      if (activeEffects.slowMotion) return 0.6;
      return 1.0;
    },

    consumeShield() {
      if (activeEffects.shield) {
        delete activeEffects.shield;
        if (typeof SoundEngine !== 'undefined') {
          SoundEngine.playShieldPop();
        }
        return true;
      }
      return false;
    },

    // Check collision with currently spawned power-up
    checkCollision(head) {
      if (spawned && head.x === spawned.x && head.y === spawned.y) {
        const picked = spawned.type;
        const def = POWERUP_DEFS[picked];
        spawned = null;

        // Activate power-up
        activeEffects[picked] = {
          remaining: def.duration,
          duration: def.duration
        };

        if (typeof SoundEngine !== 'undefined') {
          SoundEngine.playPowerUp();
        }

        if (typeof Storage !== 'undefined') {
          Storage.recordAdventureStats({ powerups: 1 });
        }

        // Show cute toast / HUD feedback
        if (typeof UI !== 'undefined' && UI.showPowerUpToast) {
          UI.showPowerUpToast(def);
        }

        spawnCooldown = 16000 + Math.random() * 8000;
        return picked;
      }
      return null;
    },

    // Try spawning a power-up on an empty cell
    trySpawn(snakeSegments, obstacleCells = [], gridCols = 24, gridRows = 24) {
      if (spawned) return;

      const occupied = new Set();
      snakeSegments.forEach(s => occupied.add(`${s.x},${s.y}`));
      obstacleCells.forEach(c => occupied.add(`${c.x},${c.y}`));

      const freeCells = [];
      for (let x = 1; x < gridCols - 1; x++) {
        for (let y = 1; y < gridRows - 1; y++) {
          if (!occupied.has(`${x},${y}`)) {
            freeCells.push({ x, y });
          }
        }
      }

      if (freeCells.length === 0) return;

      const choice = freeCells[Math.floor(Math.random() * freeCells.length)];
      const types = Object.keys(POWERUP_DEFS);
      const chosenType = types[Math.floor(Math.random() * types.length)];

      spawned = {
        x: choice.x,
        y: choice.y,
        type: chosenType,
        remaining: 14000 // Disappears after 14s if uncollected
      };
    },

    // Update timers and magnet physics
    update(deltaTime, head, foodManager, snakeSegments, obstacleCells, gridCols, gridRows) {
      animTime += deltaTime;

      // Update active powerups
      for (const type in activeEffects) {
        activeEffects[type].remaining -= deltaTime;
        if (activeEffects[type].remaining <= 0) {
          delete activeEffects[type];
        }
      }

      // Update spawned item timer
      if (spawned) {
        spawned.remaining -= deltaTime;
        if (spawned.remaining <= 0) {
          spawned = null;
          spawnCooldown = 12000;
        }
      } else {
        spawnCooldown -= deltaTime;
        if (spawnCooldown <= 0) {
          this.trySpawn(snakeSegments, obstacleCells, gridCols, gridRows);
        }
      }

      // Magnet effect: Slowly attract food within 6 grid distance towards snake head
      if (this.hasMagnet() && foodManager && head) {
        const pullFood = (f) => {
          if (!f) return;
          const dx = head.x - f.x;
          const dy = head.y - f.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0.5 && dist <= 7) {
            // Step closer on magnet tick
            if (Math.random() < 0.35) {
              if (Math.abs(dx) > Math.abs(dy)) {
                f.x += Math.sign(dx);
              } else {
                f.y += Math.sign(dy);
              }
            }
          }
        };

        pullFood(foodManager.food);
        pullFood(foodManager.bonusFood);
      }
    },

    // Render powerup item on canvas
    draw(ctx, cellSize) {
      if (!spawned) return;

      const def = POWERUP_DEFS[spawned.type];
      if (!def) return;

      const half = cellSize / 2;
      const cx = spawned.x * cellSize + half;
      const cy = spawned.y * cellSize + half + Math.sin(animTime * 0.005) * (cellSize * 0.08);
      const radius = cellSize * 0.42;

      ctx.save();

      // Soft ambient shadow
      ctx.fillStyle = 'rgba(48, 45, 53, 0.14)';
      ctx.beginPath();
      ctx.ellipse(cx, spawned.y * cellSize + cellSize * 0.88, radius * 0.85, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glowing outer ring
      ctx.strokeStyle = def.glow;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * (1.1 + Math.sin(animTime * 0.008) * 0.08), 0, Math.PI * 2);
      ctx.stroke();

      // Sphere gradient body
      const grad = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.3, radius * 0.1,
        cx, cy, radius
      );
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, def.iconBg);
      grad.addColorStop(0.9, def.color);
      grad.addColorStop(1, def.color);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Cute Icon Drawing based on type
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (spawned.type === 'shield') {
        // Shield badge
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius * 0.55);
        ctx.lineTo(cx + radius * 0.45, cy - radius * 0.3);
        ctx.lineTo(cx + radius * 0.35, cy + radius * 0.35);
        ctx.lineTo(cx, cy + radius * 0.6);
        ctx.lineTo(cx - radius * 0.35, cy + radius * 0.35);
        ctx.lineTo(cx - radius * 0.45, cy - radius * 0.3);
        ctx.closePath();
        ctx.fill();
      } else if (spawned.type === 'speedBoost') {
        // Lightning bolt
        ctx.beginPath();
        ctx.moveTo(cx + radius * 0.1, cy - radius * 0.6);
        ctx.lineTo(cx - radius * 0.35, cy + radius * 0.05);
        ctx.lineTo(cx, cy + radius * 0.05);
        ctx.lineTo(cx - radius * 0.1, cy + radius * 0.6);
        ctx.lineTo(cx + radius * 0.35, cy - radius * 0.05);
        ctx.lineTo(cx, cy - radius * 0.05);
        ctx.closePath();
        ctx.fill();
      } else if (spawned.type === 'slowMotion') {
        // Hourglass
        ctx.beginPath();
        ctx.moveTo(cx - radius * 0.35, cy - radius * 0.5);
        ctx.lineTo(cx + radius * 0.35, cy - radius * 0.5);
        ctx.lineTo(cx - radius * 0.35, cy + radius * 0.5);
        ctx.lineTo(cx + radius * 0.35, cy + radius * 0.5);
        ctx.closePath();
        ctx.stroke();
      } else if (spawned.type === 'magnet') {
        // U-Magnet
        ctx.beginPath();
        ctx.arc(cx, cy - radius * 0.05, radius * 0.38, Math.PI, 0, false);
        ctx.lineTo(cx + radius * 0.38, cy + radius * 0.4);
        ctx.lineTo(cx + radius * 0.18, cy + radius * 0.4);
        ctx.lineTo(cx + radius * 0.18, cy - radius * 0.05);
        ctx.arc(cx, cy - radius * 0.05, radius * 0.18, 0, Math.PI, true);
        ctx.lineTo(cx - radius * 0.18, cy + radius * 0.4);
        ctx.lineTo(cx - radius * 0.38, cy + radius * 0.4);
        ctx.closePath();
        ctx.fill();
      } else if (spawned.type === 'doubleCoins') {
        // 2X text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${Math.round(radius * 0.85)}px Outfit, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('2X', cx, cy);
      } else if (spawned.type === 'ghostMode') {
        // Ghost shape
        ctx.beginPath();
        ctx.arc(cx, cy - radius * 0.15, radius * 0.38, Math.PI, 0);
        ctx.lineTo(cx + radius * 0.38, cy + radius * 0.4);
        ctx.lineTo(cx + radius * 0.15, cy + radius * 0.25);
        ctx.lineTo(cx, cy + radius * 0.4);
        ctx.lineTo(cx - radius * 0.15, cy + radius * 0.25);
        ctx.lineTo(cx - radius * 0.38, cy + radius * 0.4);
        ctx.closePath();
        ctx.fill();
        // Tiny dark eyes
        ctx.fillStyle = def.color;
        ctx.beginPath();
        ctx.arc(cx - radius * 0.15, cy - radius * 0.15, 1.8, 0, Math.PI * 2);
        ctx.arc(cx + radius * 0.15, cy - radius * 0.15, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    },

    // Render active aura around the snake
    drawSnakeAura(ctx, cellSize, headPt) {
      if (!headPt) return;

      const time = animTime;

      // 1. Shimmering Protective Shield Bubble
      if (this.hasShield()) {
        ctx.save();
        const shieldR = cellSize * (0.88 + Math.sin(time * 0.007) * 0.06);

        const grad = ctx.createRadialGradient(
          headPt.x - shieldR * 0.3, headPt.y - shieldR * 0.3, shieldR * 0.2,
          headPt.x, headPt.y, shieldR
        );
        grad.addColorStop(0, 'rgba(224, 242, 254, 0.4)');
        grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.25)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.6)');

        ctx.fillStyle = grad;
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.85)';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.arc(headPt.x, headPt.y, shieldR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Specular reflection glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.beginPath();
        ctx.ellipse(headPt.x - shieldR * 0.4, headPt.y - shieldR * 0.4, shieldR * 0.28, shieldR * 0.14, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 2. Speed Boost Sparkle Trail
      if (activeEffects.speedBoost) {
        ctx.save();
        ctx.fillStyle = '#F59E0B';
        for (let i = 0; i < 4; i++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const sparkDist = cellSize * (0.4 + Math.random() * 0.5);
          const sx = headPt.x + Math.cos(sparkAngle) * sparkDist;
          const sy = headPt.y + Math.sin(sparkAngle) * sparkDist;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.random() * 2.5 + 1, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
  };
})();
