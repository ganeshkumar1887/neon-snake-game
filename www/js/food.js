/**
 * NEON SNAKE - Food & Collectibles Module
 * Manages regular neon pellets and rare timed Golden Star bonuses.
 * Ensures food never spawns inside obstacles or the snake body.
 * Synchronizes colors with the active theme palette.
 */

class FoodManager {
  constructor(gridCols = 25, gridRows = 25) {
    this.gridCols = gridCols;
    this.gridRows = gridRows;

    // Regular Food: { x, y, pulsePhase }
    this.food = null;

    // Bonus Food: { x, y, duration, remaining, maxTime }
    this.bonusFood = null;

    this.foodsEatenCount = 0;
    this.pulseAnim = 0;
  }

  // Get all currently free grid coordinates given snake segments & obstacles
  getFreeCells(snakeSegments, obstacleCells = []) {
    const occupied = new Set();
    
    // Snake segments
    if (snakeSegments && snakeSegments.length > 0) {
      snakeSegments.forEach(seg => occupied.add(`${seg.x},${seg.y}`));
    }

    // Obstacle barriers
    if (obstacleCells && obstacleCells.length > 0) {
      obstacleCells.forEach(cell => occupied.add(`${cell.x},${cell.y}`));
    }

    if (this.food) {
      occupied.add(`${this.food.x},${this.food.y}`);
    }
    if (this.bonusFood) {
      occupied.add(`${this.bonusFood.x},${this.bonusFood.y}`);
    }

    const free = [];
    for (let x = 0; x < this.gridCols; x++) {
      for (let y = 0; y < this.gridRows; y++) {
        if (!occupied.has(`${x},${y}`)) {
          free.push({ x, y });
        }
      }
    }
    return free;
  }

  // Spawn regular food in a verified free cell
  spawnFood(snakeSegments, obstacleCells = [], bonusFrequency = 4) {
    const freeCells = this.getFreeCells(snakeSegments, obstacleCells);
    if (freeCells.length === 0) return null; // Board filled!

    const pal = (typeof Themes !== 'undefined') ? Themes.getPalette() : null;
    const foodColor = pal ? pal.food : '#ff3366';
    const glowColor = pal ? pal.foodGlow : 'rgba(255, 51, 102, 0.8)';

    const randomIndex = Math.floor(Math.random() * freeCells.length);
    const chosen = freeCells[randomIndex];

    this.food = {
      x: chosen.x,
      y: chosen.y,
      color: foodColor,
      glowColor: glowColor,
      type: 'regular',
      points: 10
    };

    // Chance to spawn bonus food based on mode bonusFrequency
    const freq = Math.max(1, bonusFrequency || 4);
    if (!this.bonusFood && this.foodsEatenCount > 0 && this.foodsEatenCount % freq === 0) {
      this.spawnBonus(snakeSegments, obstacleCells);
    }

    return this.food;
  }

  // Spawn rare timed golden star food
  spawnBonus(snakeSegments, obstacleCells = []) {
    const freeCells = this.getFreeCells(snakeSegments, obstacleCells);
    if (freeCells.length === 0) return;

    const pal = (typeof Themes !== 'undefined') ? Themes.getPalette() : null;
    const bonusColor = pal ? pal.bonus : '#ffdd00';
    const bonusGlow = pal ? pal.bonusGlow : 'rgba(255, 221, 0, 0.9)';

    const randomIndex = Math.floor(Math.random() * freeCells.length);
    const chosen = freeCells[randomIndex];

    const bonusDuration = 8000; // 8 seconds
    this.bonusFood = {
      x: chosen.x,
      y: chosen.y,
      color: bonusColor,
      glowColor: bonusGlow,
      type: 'bonus',
      points: 50,
      maxTime: bonusDuration,
      remaining: bonusDuration
    };
  }

  // Update bonus food timer
  update(deltaTime) {
    this.pulseAnim += deltaTime * 0.005;

    if (this.bonusFood) {
      this.bonusFood.remaining -= deltaTime;
      if (this.bonusFood.remaining <= 0) {
        this.bonusFood = null; // Expired
      }
    }
  }

  // Check collision between snake head and any food
  checkCollision(head) {
    // Regular food
    if (this.food && head.x === this.food.x && head.y === this.food.y) {
      const eaten = this.food;
      this.food = null;
      this.foodsEatenCount++;
      return eaten;
    }

    // Bonus food
    if (this.bonusFood && head.x === this.bonusFood.x && head.y === this.bonusFood.y) {
      const eaten = this.bonusFood;
      this.bonusFood = null;
      return eaten;
    }

    return null;
  }

  // Draw foods onto the game canvas (Cute cartoon casual design)
  draw(ctx, cellSize) {
    const half = cellSize / 2;
    const pal = (typeof Themes !== 'undefined') ? Themes.getPalette() : null;

    // 1. Draw Regular Food: Juicy Cartoon Fruit (Apple / Strawberry with Cute Leaf)
    if (this.food) {
      const cx = this.food.x * cellSize + half;
      const cy = this.food.y * cellSize + half + Math.sin(this.pulseAnim * 4) * (cellSize * 0.04);
      const baseRadius = cellSize * 0.36;
      const pulse = Math.sin(this.pulseAnim * 5) * (cellSize * 0.03);
      const r = Math.max(3, baseRadius + pulse);

      const foodColor = pal ? pal.food : (this.food.color || '#FF777D');
      const leafColor = pal ? (pal.foodLeaf || '#4ADE80') : '#4ADE80';

      ctx.save();

      // Soft friendly shadow underneath
      ctx.fillStyle = 'rgba(48, 45, 53, 0.12)';
      ctx.beginPath();
      ctx.ellipse(cx, this.food.y * cellSize + cellSize * 0.86, r * 0.9, r * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // A. Cute Green Leaf Stem on top
      ctx.fillStyle = leafColor;
      ctx.beginPath();
      ctx.ellipse(cx + r * 0.35, cy - r * 0.85, r * 0.45, r * 0.22, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Tiny brown/dark stem
      ctx.strokeStyle = '#5A4A42';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 0.6);
      ctx.quadraticCurveTo(cx - 1, cy - r * 1.05, cx + 2, cy - r * 1.15);
      ctx.stroke();

      // B. Plump Rounded Fruit Body with 3D Gloss Shading
      const fruitGrad = ctx.createRadialGradient(
        cx - r * 0.25, cy - r * 0.25, r * 0.1,
        cx, cy, r
      );
      fruitGrad.addColorStop(0, '#FFA8AC');
      fruitGrad.addColorStop(0.4, foodColor);
      fruitGrad.addColorStop(1, '#D84952');

      ctx.fillStyle = fruitGrad;
      ctx.beginPath();
      // Cute heart-rounded fruit shape
      ctx.arc(cx - r * 0.28, cy - r * 0.05, r * 0.72, Math.PI * 0.7, Math.PI * 1.9);
      ctx.arc(cx + r * 0.28, cy - r * 0.05, r * 0.72, Math.PI * 1.1, Math.PI * 0.3);
      ctx.quadraticCurveTo(cx, cy + r * 1.05, cx - r * 0.28, cy - r * 0.05);
      ctx.closePath();
      ctx.fill();

      // C. Glossy White Catchlight Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.32, cy - r * 0.38, r * 0.3, r * 0.16, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.beginPath();
      ctx.arc(cx - r * 0.14, cy - r * 0.16, r * 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. Draw Bonus Golden Star Food: Cute Sparkling Star with Twinkle
    if (this.bonusFood) {
      const cx = this.bonusFood.x * cellSize + half;
      const cy = this.bonusFood.y * cellSize + half + Math.sin(this.pulseAnim * 6) * (cellSize * 0.06);
      const outerR = cellSize * 0.44 + Math.sin(this.pulseAnim * 8) * (cellSize * 0.04);
      const innerR = outerR * 0.48;

      const bonusColor = pal ? pal.bonus : '#FFE987';

      ctx.save();

      // Soft shadow
      ctx.fillStyle = 'rgba(48, 45, 53, 0.12)';
      ctx.beginPath();
      ctx.ellipse(cx, this.bonusFood.y * cellSize + cellSize * 0.88, outerR * 0.85, outerR * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Soft golden aura glow (lightweight radial halo instead of expensive shadowBlur)
      ctx.fillStyle = 'rgba(255, 215, 0, 0.22)';
      ctx.beginPath();
      ctx.arc(cx, cy, outerR * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Draw Cute 5-pointed Rounded Star
      ctx.fillStyle = bonusColor;
      const starGrad = ctx.createRadialGradient(cx, cy - outerR * 0.2, innerR * 0.2, cx, cy, outerR);
      starGrad.addColorStop(0, '#FFFBEB');
      starGrad.addColorStop(0.5, bonusColor);
      starGrad.addColorStop(1, '#F59E0B');
      ctx.fillStyle = starGrad;

      ctx.beginPath();
      const points = 5;
      const rot = -Math.PI / 2 + Math.sin(this.pulseAnim * 2) * 0.15; // Gentle rocking wobble

      for (let i = 0; i < points; i++) {
        let x = cx + Math.cos(rot + (i * 2 * Math.PI) / points) * outerR;
        let y = cy + Math.sin(rot + (i * 2 * Math.PI) / points) * outerR;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x = cx + Math.cos(rot + ((i + 0.5) * 2 * Math.PI) / points) * innerR;
        y = cy + Math.sin(rot + ((i + 0.5) * 2 * Math.PI) / points) * innerR;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      // Outline
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Cute anime star sparkle eyes
      ctx.fillStyle = '#302D35';
      const eyeOffset = innerR * 0.45;
      ctx.beginPath();
      ctx.arc(cx - eyeOffset, cy - innerR * 0.05, 1.8, 0, Math.PI * 2);
      ctx.arc(cx + eyeOffset, cy - innerR * 0.05, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Rosy blush on star
      ctx.fillStyle = 'rgba(255, 119, 125, 0.5)';
      ctx.beginPath();
      ctx.arc(cx - eyeOffset - 1, cy + 2, 2.2, 0, Math.PI * 2);
      ctx.arc(cx + eyeOffset + 1, cy + 2, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Top gloss highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(cx - innerR * 0.4, cy - innerR * 0.4, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  reset() {
    this.food = null;
    this.bonusFood = null;
    this.foodsEatenCount = 0;
  }
}
