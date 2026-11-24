/**
 * NEON SNAKE - Realistic Serpentine Character Module
 * Biological snake anatomy: continuous smooth muscular spine, 3D cylindrical shading,
 * realistic reptilian scales, anatomical viper head with predatory slit eyes, nostrils,
 * forked flicking tongue, tapered pointed tail, sub-tick smooth slithering motion,
 * wrap-around screen traversal (for Infinity Mode), and dynamic theme palette support.
 */

class Snake {
  constructor(gridCols = 25, gridRows = 25) {
    this.gridCols = gridCols;
    this.gridRows = gridRows;
    this.wrapWalls = false;
    this.reset();
  }

  setWrapWalls(enabled) {
    this.wrapWalls = !!enabled;
  }

  reset() {
    const startX = Math.floor(this.gridCols / 2);
    const startY = Math.floor(this.gridRows / 2);

    // Initial segments horizontally
    this.segments = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY },
      { x: startX - 3, y: startY },
      { x: startX - 4, y: startY }
    ];

    this.prevSegments = this.segments.map(s => ({ x: s.x, y: s.y }));
    this.direction = { x: 1, y: 0 };
    this.currentAngle = 0;
    this.targetAngle = 0;
    this.inputQueue = [];
    this.pendingGrowth = 0;
    this.eatTime = 0;
    this.surprisedUntil = 0;
    this.isDead = false;
  }

  // Set cute surprised expression (when near hazard, picking powerup or rescuing baby)
  setSurprised(durationMs = 850) {
    this.surprisedUntil = performance.now() + durationMs;
  }

  // Queue a directional turn (prevents direct 180-degree reversal)
  setDirection(newDir) {
    const lastDir = this.inputQueue.length > 0 
      ? this.inputQueue[this.inputQueue.length - 1] 
      : this.direction;

    const isOpposite = (newDir.x === -lastDir.x && newDir.y === -lastDir.y);
    const isSame = (newDir.x === lastDir.x && newDir.y === lastDir.y);

    if (!isOpposite && !isSame && this.inputQueue.length < 2) {
      this.inputQueue.push(newDir);
    }
  }

  // Advance snake by one grid tick
  move() {
    if (this.isDead) return;

    // Snapshot previous positions for smooth 60 FPS sub-tick interpolation
    this.prevSegments = this.segments.map(s => ({ x: s.x, y: s.y }));

    // Apply next buffered direction
    if (this.inputQueue.length > 0) {
      this.direction = this.inputQueue.shift();
    }

    this.targetAngle = Math.atan2(this.direction.y, this.direction.x);

    const head = this.segments[0];
    let newX = head.x + this.direction.x;
    let newY = head.y + this.direction.y;

    // Wall wrap-around for Infinity Mode
    if (this.wrapWalls) {
      newX = (newX + this.gridCols) % this.gridCols;
      newY = (newY + this.gridRows) % this.gridRows;
    }

    const newHead = { x: newX, y: newY };

    // Advance head
    this.segments.unshift(newHead);

    // If growing, don't pop tail; expand prevSegments so tail interpolation doesn't snap
    if (this.pendingGrowth > 0) {
      this.pendingGrowth--;
      const lastPrev = this.prevSegments[this.prevSegments.length - 1];
      this.prevSegments.push({ x: lastPrev.x, y: lastPrev.y });
    } else {
      this.segments.pop();
    }
  }

  grow(amount = 1) {
    this.pendingGrowth += amount;
    this.eatTime = performance.now();
  }

  checkWallCollision() {
    if (this.wrapWalls) return false;

    const head = this.segments[0];
    return (
      head.x < 0 ||
      head.x >= this.gridCols ||
      head.y < 0 ||
      head.y >= this.gridRows
    );
  }

  checkSelfCollision() {
    const head = this.segments[0];
    for (let i = 1; i < this.segments.length; i++) {
      if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
        return true;
      }
    }
    return false;
  }

  // Draw realistic snake with smooth sub-tick movement and biological curves
  draw(ctx, cellSize, progress = 1) {
    const len = this.segments.length;
    if (len === 0) return;

    const time = performance.now();
    ctx.save();

    // Palette resolution from active theme combined with Fashion Studio skin
    let pal = (typeof Themes !== 'undefined') ? Themes.getPalette() : {
      crest: '#85EA46',
      body: '#4ECB23',
      shade: '#26850E',
      belly: '#FFF58A',
      scaleStroke: 'rgba(255, 255, 255, 0.65)',
      scaleFillEven: '#FFF58A',
      scaleFillOdd: '#85EA46',
      blush: '#FF7E98',
      eyeCornea: '#302D35',
      eyePupil: '#1E1B24',
      eyeHighlight: '#FFFFFF',
      tongue: '#FF6B8B'
    };

    if (typeof FashionStudio !== 'undefined') {
      const customColors = FashionStudio.getActiveColors();
      if (customColors) {
        pal = { ...pal, ...customColors };
      }
    }

    const activePattern = (typeof FashionStudio !== 'undefined') ? FashionStudio.getActivePattern() : 'pattern_smooth';
    const activeHat = (typeof FashionStudio !== 'undefined') ? FashionStudio.getActiveHat() : 'hat_none';

    // Ghost Mode power-up transparency
    if (typeof PowerUpManager !== 'undefined' && PowerUpManager.hasGhostMode()) {
      ctx.globalAlpha = 0.52;
    }

    const isEating = (time - this.eatTime < 450);
    const eatProgress = isEating ? (time - this.eatTime) / 450 : 0;
    const chompScale = isEating ? Math.sin(eatProgress * Math.PI) : 0;
    const isSurprised = (time < this.surprisedUntil);

    // Smooth head turning angle interpolation
    const angleDiff = Math.atan2(
      Math.sin(this.targetAngle - this.currentAngle),
      Math.cos(this.targetAngle - this.currentAngle)
    );
    this.currentAngle += angleDiff * 0.24;

    // 1. Calculate interpolated points along the spine with natural lateral wave
    const points = [];
    for (let i = 0; i < len; i++) {
      const curr = this.segments[i];
      const prev = (this.prevSegments && this.prevSegments[i]) ? this.prevSegments[i] : curr;

      // Check distance for wrap handling
      const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);
      let ix = curr.x;
      let iy = curr.y;
      if (dist <= 1.5) {
        ix = prev.x + (curr.x - prev.x) * progress;
        iy = prev.y + (curr.y - prev.y) * progress;
      }

      let px = ix * cellSize + cellSize / 2;
      let py = iy * cellSize + cellSize / 2;

      // Calculate tangent
      let tx, ty;
      if (i === 0) {
        tx = Math.cos(this.currentAngle);
        ty = Math.sin(this.currentAngle);
      } else {
        const prevPt = points[i - 1];
        let dx = prevPt.x - px;
        let dy = prevPt.y - py;
        // Unwrap wrap-around jumps across board edges
        if (Math.abs(dx) > cellSize * 2) {
          dx = (dx > 0) ? dx - this.gridCols * cellSize : dx + this.gridCols * cellSize;
        }
        if (Math.abs(dy) > cellSize * 2) {
          dy = (dy > 0) ? dy - this.gridRows * cellSize : dy + this.gridRows * cellSize;
        }
        const d = Math.hypot(dx, dy) || 1;
        tx = dx / d;
        ty = dy / d;
      }

      // Lateral serpentine wave (subtle S-curve undulation while slithering)
      const wavePhase = (time * 0.007) - (i * 0.52);
      const waveAmp = (i === 0 ? 0.02 : Math.min(0.22, 0.04 + (i / len) * 0.16)) * cellSize;
      const waveOffset = Math.sin(wavePhase) * waveAmp;

      px += -ty * waveOffset;
      py += tx * waveOffset;

      points.push({ x: px, y: py, angle: Math.atan2(ty, tx) });
    }

    // 2. Draw Continuous Cute Body Bridges (Soft Cylindrical Connection)
    for (let i = len - 1; i > 0; i--) {
      const p1 = points[i];
      const p2 = points[i - 1];

      // If wrapped across board boundaries, don't bridge line across the screen
      if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > cellSize * 2) {
        continue;
      }

      // Normalized progress: 0 at tail tip, 1 at neck
      const t = (len - 1 - i) / Math.max(1, len - 2);

      // Tapering: sleek pointed tail -> plump midbody -> smooth neck
      let rFactor;
      if (i > len - 4) {
        const tailProg = (len - 1 - i) / 3;
        rFactor = 0.22 + tailProg * 0.22;
      } else {
        rFactor = 0.44 + Math.sin(t * Math.PI) * 0.08;
      }
      const bodyRadius = cellSize * rFactor;

      ctx.save();
      // Soft gentle ambient shadow under snake
      ctx.shadowColor = 'rgba(48, 45, 53, 0.14)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;

      ctx.strokeStyle = pal.shade || '#9875E6';
      ctx.lineWidth = bodyRadius * 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      // Top dorsal ridge (Main pastel color)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = pal.body || '#BFA5FF';
      ctx.lineWidth = bodyRadius * 1.5;
      ctx.stroke();

      ctx.restore();
    }

    // 3. Draw Plump Rounded Body Segments with 3D Spherical Shading & Soft Highlights
    for (let i = len - 1; i >= 1; i--) {
      const pt = points[i];
      const t = (len - 1 - i) / Math.max(1, len - 2);

      let rFactor;
      if (i > len - 4) {
        const tailProg = (len - 1 - i) / 3;
        rFactor = 0.22 + tailProg * 0.22;
      } else {
        rFactor = 0.44 + Math.sin(t * Math.PI) * 0.08;
      }
      const radius = cellSize * rFactor;

      ctx.save();
      ctx.translate(pt.x, pt.y);
      ctx.rotate(pt.angle);

      // A. 3D Spherical Pastel Gradient
      const grad = ctx.createRadialGradient(
        -radius * 0.25, -radius * 0.35, radius * 0.1,
        0, 0, radius
      );
      grad.addColorStop(0, pal.crest || '#E4D6FF');     // Soft crest highlight
      grad.addColorStop(0.45, pal.body || '#BFA5FF');   // Saturated body
      grad.addColorStop(1, pal.shade || '#9875E6');     // Gentle shadow rim

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.12, radius, 0, 0, Math.PI * 2);
      ctx.fill();

      // B. Cute Cream-Yellow Belly Underbelly Arc
      ctx.fillStyle = pal.belly || '#FFF58A';
      ctx.beginPath();
      ctx.ellipse(0, radius * 0.32, radius * 0.76, radius * 0.4, 0, 0, Math.PI);
      ctx.fill();

      // C. Glossy Catchlight Reflection (Like a smooth jelly or vinyl toy)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.ellipse(-radius * 0.25, -radius * 0.4, radius * 0.36, radius * 0.18, -Math.PI / 8, 0, Math.PI * 2);
      ctx.fill();

      // D. Custom Fashion Body Pattern Overlays
      if (activePattern === 'pattern_stripes' && i % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.4, radius * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (activePattern === 'pattern_spots') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.beginPath();
        ctx.arc(0, -radius * 0.35, radius * 0.22, 0, Math.PI * 2);
        ctx.arc(0, radius * 0.35, radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else if (activePattern === 'pattern_rings') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.82, radius * 0.72, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 4. Draw Natural Pointed Tail Tip
    if (len > 1) {
      const tailPt = points[len - 1];
      const prevTail = points[len - 2];
      const dist = Math.hypot(tailPt.x - prevTail.x, tailPt.y - prevTail.y);

      if (dist < cellSize * 2) {
        const tailAngle = Math.atan2(tailPt.y - prevTail.y, tailPt.x - prevTail.x);

        ctx.save();
        ctx.translate(tailPt.x, tailPt.y);
        ctx.rotate(tailAngle);

        ctx.fillStyle = pal.body || '#4ECB23';
        ctx.shadowColor = 'rgba(22, 101, 52, 0.18)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.moveTo(0, -cellSize * 0.15);
        ctx.lineTo(cellSize * 0.34, 0); // Pointed tip
        ctx.lineTo(0, cellSize * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 5. Draw Cute Expressive Snake Head
    const headPt = points[0];
    ctx.save();
    ctx.translate(headPt.x, headPt.y);
    ctx.rotate(this.currentAngle);

    this.drawRealisticHead(ctx, cellSize, time, pal, isEating, chompScale, isSurprised);

    // Wearable Hat / Accessories from Fashion Studio
    if (typeof FashionStudio !== 'undefined') {
      FashionStudio.drawHatOnHead(ctx, cellSize, activeHat, time);
    }

    // Evolution Prestige Features (Horns, Crest, Jewels)
    if (typeof SnakeEvolution !== 'undefined') {
      SnakeEvolution.drawEvolutionFeatures(ctx, cellSize, time);
    }

    ctx.restore();

    // Active Power-up Auras (Protective Shield Bubble, Speed Sparks)
    if (typeof PowerUpManager !== 'undefined') {
      PowerUpManager.drawSnakeAura(ctx, cellSize, headPt);
    }

    ctx.restore();
  }

  // Draw cute, friendly, expressive cartoon snake head
  drawRealisticHead(ctx, cellSize, time, pal, isEating = false, chompScale = 0, isSurprised = false) {
    const headLen = cellSize * 0.76;
    const headWidth = cellSize * 0.64;

    // --- A. Animated Cute Pink Tongue ---
    const tongueCycle = (time % 2200);
    if (!isEating && tongueCycle < 550) {
      const progress = Math.sin((tongueCycle / 550) * Math.PI);
      const tLen = cellSize * (0.35 + progress * 0.55);
      const wag = Math.sin(time * 0.04) * (cellSize * 0.08);

      ctx.save();
      ctx.strokeStyle = pal.tongue || '#FF6B8B';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';

      // Base tongue shaft
      ctx.beginPath();
      ctx.moveTo(headLen * 0.52, 0);
      ctx.lineTo(headLen * 0.52 + tLen, wag);
      ctx.stroke();

      // Cute forked tips
      const tipX = headLen * 0.52 + tLen;
      const forkSpread = cellSize * 0.16;
      const forkLen = cellSize * 0.18;

      ctx.beginPath();
      ctx.moveTo(tipX, wag);
      ctx.lineTo(tipX + forkLen, wag - forkSpread);
      ctx.moveTo(tipX, wag);
      ctx.lineTo(tipX + forkLen, wag + forkSpread);
      ctx.stroke();

      ctx.restore();
    }

    // --- B. Cute Rounded Head Shape & Squash/Stretch ---
    ctx.save();
    // Gentle soft drop shadow
    ctx.shadowColor = 'rgba(22, 101, 52, 0.22)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;

    if (isEating) {
      ctx.scale(1.0 + chompScale * 0.16, 1.0 - chompScale * 0.1);
    }

    ctx.beginPath();
    ctx.moveTo(headLen * 0.62, 0); // Snout tip
    // Top head curve
    ctx.bezierCurveTo(
      headLen * 0.5, -headWidth * 0.45,
      headLen * 0.1, -headWidth * 0.62,
      -headLen * 0.4, -headWidth * 0.48
    );
    // Neck connection
    ctx.bezierCurveTo(
      -headLen * 0.55, -headWidth * 0.22,
      -headLen * 0.55, headWidth * 0.22,
      -headLen * 0.4, headWidth * 0.48
    );
    // Bottom head curve
    ctx.bezierCurveTo(
      headLen * 0.1, headWidth * 0.62,
      headLen * 0.5, headWidth * 0.45,
      headLen * 0.62, 0
    );
    ctx.closePath();

    // 3D Head Gradient (Soft, smooth, friendly green)
    const headGrad = ctx.createRadialGradient(
      headLen * 0.1, -headWidth * 0.15, cellSize * 0.1,
      0, 0, headLen * 0.85
    );
    headGrad.addColorStop(0, pal.crest || '#85EA46');
    headGrad.addColorStop(0.45, pal.body || '#4ECB23');
    headGrad.addColorStop(1, pal.shade || '#26850E');

    ctx.fillStyle = headGrad;
    ctx.fill();

    // Head outline (crisp subtle line)
    ctx.shadowBlur = 0;
    ctx.strokeStyle = pal.shade || '#26850E';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Light Cream-Yellow Belly on Head Bottom
    ctx.fillStyle = pal.belly || '#FFF58A';
    ctx.beginPath();
    ctx.ellipse(0, headWidth * 0.32, headLen * 0.75, headWidth * 0.36, 0, 0, Math.PI);
    ctx.fill();

    // --- C. Rosy Pink Blush Cheeks ---
    const blushX = headLen * 0.08;
    const blushY = headWidth * 0.48;
    const blushR = cellSize * 0.14;

    ctx.fillStyle = isEating ? '#FF5C80' : (pal.blush || '#FF7E98');
    [-1, 1].forEach(side => {
      ctx.beginPath();
      ctx.ellipse(blushX, blushY * side, blushR * (isEating ? 1.4 : 1.25), blushR * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- D. Mouth & Smile / Eating Chomp / Surprised ---
    if (isEating) {
      // Happy open chomp mouth
      ctx.fillStyle = '#991B1B';
      ctx.beginPath();
      ctx.ellipse(headLen * 0.45, 0, headLen * 0.22 * chompScale, headWidth * 0.26 * chompScale, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tiny white tooth
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(headLen * 0.45, -headWidth * 0.12 * chompScale, cellSize * 0.045, 0, Math.PI * 2);
      ctx.fill();
    } else if (isSurprised) {
      // Cute round surprised mouth "o"
      ctx.fillStyle = '#991B1B';
      ctx.beginPath();
      ctx.ellipse(headLen * 0.42, 0, headLen * 0.12, headWidth * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    } else {
      // Subtle happy snout smile curve
      ctx.strokeStyle = pal.shade || '#26850E';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(headLen * 0.38, 0, headWidth * 0.16, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }

    // --- E. Large Expressive Cartoon Eyes (with Blinking, Surprise & Happy Eating) ---
    const blinkCycle = (time % 3600);
    const isBlinking = blinkCycle < 140;

    const eyeX = headLen * 0.16;
    const eyeY = headWidth * 0.36;
    const eyeRadius = cellSize * 0.16;

    [-1, 1].forEach(side => {
      const curY = eyeY * side;

      if (isEating) {
        // Cheerful smiling crescent eye (^ ^)
        ctx.strokeStyle = pal.eyePupil || '#1E1B24';
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(eyeX, curY, eyeRadius * 0.75, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      } else if (isSurprised) {
        // Wide surprised cartoon eyes (O O)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(eyeX, curY, eyeRadius * 1.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = pal.shade || '#26850E';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.fillStyle = pal.eyePupil || '#1E1B24';
        ctx.beginPath();
        ctx.arc(eyeX, curY, eyeRadius * 0.72, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(eyeX - eyeRadius * 0.25, curY - eyeRadius * 0.25 * side, eyeRadius * 0.36, 0, Math.PI * 2);
        ctx.fill();
      } else if (isBlinking) {
        // Closed blinking eyelid arc
        ctx.strokeStyle = pal.eyePupil || '#1E1B24';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(eyeX, curY, eyeRadius * 0.7, 0.2, Math.PI - 0.2);
        ctx.stroke();
      } else {
        // 1. Clean eye white socket
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(eyeX, curY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Large cute dark pupil
        ctx.fillStyle = pal.eyePupil || '#1E1B24';
        ctx.beginPath();
        ctx.arc(eyeX + 0.5, curY, eyeRadius * 0.78, 0, Math.PI * 2);
        ctx.fill();

        // 3. Primary White Catchlight Highlight (Top-left shine)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(eyeX - eyeRadius * 0.22, curY - eyeRadius * 0.25 * side, eyeRadius * 0.34, 0, Math.PI * 2);
        ctx.fill();

        // 4. Secondary Tiny Sparkle Catchlight (Bottom-right)
        ctx.beginPath();
        ctx.arc(eyeX + eyeRadius * 0.32, curY + eyeRadius * 0.3 * side, eyeRadius * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // --- F. Cute Tiny Nostrils ---
    ctx.fillStyle = 'rgba(38, 133, 14, 0.65)';
    [-1, 1].forEach(side => {
      ctx.beginPath();
      ctx.arc(headLen * 0.52, headWidth * 0.12 * side, 1.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // --- G. Snout Top Gloss Shine ---
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.ellipse(headLen * 0.38, 0, cellSize * 0.12, cellSize * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
