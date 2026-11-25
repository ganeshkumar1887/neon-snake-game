/**
 * NEON SNAKE - Obstacles & Level Maps Module
 * Defines 10 progressive obstacle maps for Obstacle Mode.
 * Ensures food never spawns inside barriers, detects collisions,
 * and renders glowing cyber barriers using the active theme palette.
 */

const ObstaclesManager = (() => {
  // Grid is 25x25 (coordinates 0..24, center is (12, 12))
  // Snake spawns around (12, 12) moving right, so spawn area (x: 8..14, y: 11..13) is kept safe.

  const MAPS = [
    // Level 1: "Four Pillars" - Simple outer barrier pylons
    {
      level: 1,
      name: 'Four Pillars',
      obstacles: [
        { x: 5, y: 5, w: 2, h: 2 },
        { x: 18, y: 5, w: 2, h: 2 },
        { x: 5, y: 18, w: 2, h: 2 },
        { x: 18, y: 18, w: 2, h: 2 }
      ]
    },

    // Level 2: "Corner Bastions" - L-shaped corner barriers
    {
      level: 2,
      name: 'Corner Bastions',
      obstacles: [
        { x: 3, y: 3, w: 5, h: 1 },
        { x: 3, y: 4, w: 1, h: 4 },
        { x: 17, y: 3, w: 5, h: 1 },
        { x: 21, y: 4, w: 1, h: 4 },
        { x: 3, y: 21, w: 5, h: 1 },
        { x: 3, y: 17, w: 1, h: 4 },
        { x: 17, y: 21, w: 5, h: 1 },
        { x: 21, y: 17, w: 1, h: 4 }
      ]
    },

    // Level 3: "Twin Slits" - Vertical defensive walls with middle & outer slits
    {
      level: 3,
      name: 'Twin Slits',
      obstacles: [
        { x: 7, y: 2, w: 1, h: 7 },
        { x: 7, y: 16, w: 1, h: 7 },
        { x: 17, y: 2, w: 1, h: 7 },
        { x: 17, y: 16, w: 1, h: 7 }
      ]
    },

    // Level 4: "Central Cross" - Outer cross barriers with open center
    {
      level: 4,
      name: 'Central Cross',
      obstacles: [
        { x: 12, y: 2, w: 1, h: 6 },
        { x: 12, y: 17, w: 1, h: 6 },
        { x: 2, y: 12, w: 6, h: 1 },
        { x: 17, y: 12, w: 6, h: 1 }
      ]
    },

    // Level 5: "Slalom" - Horizontal alternating baffles
    {
      level: 5,
      name: 'Slalom Hurdle',
      obstacles: [
        { x: 3, y: 6, w: 14, h: 1 },
        { x: 8, y: 18, w: 14, h: 1 },
        { x: 4, y: 12, w: 2, h: 2 },
        { x: 19, y: 12, w: 2, h: 2 }
      ]
    },

    // Level 6: "The Fortress" - Concentric defense barriers
    {
      level: 6,
      name: 'The Fortress',
      obstacles: [
        { x: 6, y: 6, w: 13, h: 1 },
        { x: 6, y: 18, w: 13, h: 1 },
        { x: 6, y: 7, w: 1, h: 4 },
        { x: 6, y: 14, w: 1, h: 4 },
        { x: 18, y: 7, w: 1, h: 4 },
        { x: 18, y: 14, w: 1, h: 4 }
      ]
    },

    // Level 7: "Divided Matrix" - 4-room quadrant with central doorways
    {
      level: 7,
      name: 'Divided Matrix',
      obstacles: [
        { x: 12, y: 2, w: 1, h: 7 },
        { x: 12, y: 16, w: 1, h: 7 },
        { x: 2, y: 7, w: 7, h: 1 },
        { x: 16, y: 7, w: 7, h: 1 },
        { x: 2, y: 17, w: 7, h: 1 },
        { x: 16, y: 17, w: 7, h: 1 }
      ]
    },

    // Level 8: "Minefield" - Staggered cyber pylons
    {
      level: 8,
      name: 'Cyber Minefield',
      obstacles: [
        { x: 4, y: 4, w: 2, h: 2 },
        { x: 12, y: 4, w: 2, h: 2 },
        { x: 19, y: 4, w: 2, h: 2 },
        { x: 4, y: 19, w: 2, h: 2 },
        { x: 12, y: 19, w: 2, h: 2 },
        { x: 19, y: 19, w: 2, h: 2 },
        { x: 6, y: 9, w: 2, h: 2 },
        { x: 17, y: 9, w: 2, h: 2 },
        { x: 6, y: 15, w: 2, h: 2 },
        { x: 17, y: 15, w: 2, h: 2 }
      ]
    },

    // Level 9: "Gauntlet Corridors" - Narrow zig-zag maze channels
    {
      level: 9,
      name: 'The Gauntlet',
      obstacles: [
        { x: 4, y: 5, w: 17, h: 1 },
        { x: 4, y: 9, w: 1, h: 8 },
        { x: 20, y: 9, w: 1, h: 8 },
        { x: 4, y: 19, w: 17, h: 1 },
        { x: 8, y: 12, w: 2, h: 2 },
        { x: 15, y: 12, w: 2, h: 2 }
      ]
    },

    // Level 10: "Cyber Core" - Ultimate master labyrinth
    {
      level: 10,
      name: 'Cyber Core Master',
      obstacles: [
        { x: 3, y: 3, w: 6, h: 1 },
        { x: 16, y: 3, w: 6, h: 1 },
        { x: 3, y: 21, w: 6, h: 1 },
        { x: 16, y: 21, w: 6, h: 1 },
        { x: 3, y: 4, w: 1, h: 6 },
        { x: 21, y: 4, w: 1, h: 6 },
        { x: 3, y: 15, w: 1, h: 6 },
        { x: 21, y: 15, w: 1, h: 6 },
        { x: 8, y: 7, w: 9, h: 1 },
        { x: 8, y: 17, w: 9, h: 1 },
        { x: 7, y: 10, w: 1, h: 5 },
        { x: 17, y: 10, w: 1, h: 5 }
      ]
    }
  ];

  let currentLevel = 1;
  let currentGrid = new Set(); // Stores "x,y" strings of all filled cells

  // Convert rect obstacles into individual grid points
  const compileGrid = (levelIndex) => {
    const idx = Math.max(0, Math.min(MAPS.length - 1, levelIndex - 1));
    const map = MAPS[idx];
    const cells = new Set();

    map.obstacles.forEach(obs => {
      for (let ox = 0; ox < obs.w; ox++) {
        for (let oy = 0; oy < obs.h; oy++) {
          cells.add(`${obs.x + ox},${obs.y + oy}`);
        }
      }
    });

    return cells;
  };

  return {
    init(level = 1) {
      this.setLevel(level);
    },

    setLevel(lvl) {
      currentLevel = Math.max(1, Math.min(MAPS.length, lvl));
      currentGrid = compileGrid(currentLevel);
      return this.getLevelData();
    },

    getCurrentLevel() {
      return currentLevel;
    },

    getMaxLevel() {
      return MAPS.length;
    },

    getLevelData() {
      const idx = currentLevel - 1;
      return MAPS[idx];
    },

    getObstacleCells() {
      const cells = [];
      currentGrid.forEach(key => {
        const [x, y] = key.split(',').map(Number);
        cells.push({ x, y });
      });
      return cells;
    },

    checkCollision(head) {
      return currentGrid.has(`${head.x},${head.y}`);
    },

    draw(ctx, cellSize, palette) {
      if (!currentGrid || currentGrid.size === 0) return;

      const pal = palette || (typeof Themes !== 'undefined' ? Themes.getPalette() : null);
      const fillStyle = pal ? pal.obstacleFill : '#EADBFF';
      const strokeStyle = pal ? pal.obstacleBorder : '#BFA5FF';

      ctx.save();

      currentGrid.forEach(key => {
        const [x, y] = key.split(',').map(Number);
        const px = x * cellSize;
        const py = y * cellSize;
        const pad = 2;
        const bSize = cellSize - pad * 2;
        const radius = 5;

        // Soft toy block drop shadow
        ctx.fillStyle = 'rgba(48, 45, 53, 0.08)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(px + pad, py + pad + 2, bSize, bSize, radius);
        } else {
          ctx.rect(px + pad, py + pad + 2, bSize, bSize);
        }
        ctx.fill();

        // Base rounded pastel toy block
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(px + pad, py + pad, bSize, bSize, radius);
        } else {
          ctx.rect(px + pad, py + pad, bSize, bSize);
        }
        ctx.fill();

        // Block border
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Top-left bevel highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(px + pad + 5, py + pad + 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    }
  };
})();
