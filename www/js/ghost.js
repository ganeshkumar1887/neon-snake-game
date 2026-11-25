/**
 * NEON SNAKE - Ghost Rival System
 * Records the player's personal best run trajectory and replays it
 * as a friendly, translucent, non-colliding phantom snake rival.
 * Computes live real-time score difference (+Ahead / -Behind).
 */

const GhostRival = (() => {
  let isRecording = false;
  let recordedTrail = []; // [ { x, y, time, score } ]
  let replayTrail = []; // Active ghost trail from storage
  let replayIndex = 0;
  let replaySnake = []; // Ghost body coordinates
  let currentDelta = 0; // Current score - Ghost score
  let isEnabled = true;

  return {
    init() {
      const settings = (typeof Storage !== 'undefined') ? Storage.getSettings() : {};
      isEnabled = settings.ghostRival !== false;
    },

    startRun(mode = 'classic') {
      recordedTrail = [];
      replayTrail = [];
      replayIndex = 0;
      replaySnake = [];
      currentDelta = 0;
      isRecording = true;

      const settings = (typeof Storage !== 'undefined') ? Storage.getSettings() : {};
      isEnabled = settings.ghostRival !== false;

      // Load previous best ghost run for this mode
      if (isEnabled && typeof Storage !== 'undefined') {
        const saved = Storage.getGhostRun(mode);
        if (saved && saved.trail && saved.trail.length > 5) {
          replayTrail = saved.trail;
        }
      }
    },

    recordStep(headX, headY, currentScore, elapsedTimeMs) {
      if (!isRecording) return;
      recordedTrail.push({
        x: headX,
        y: headY,
        score: currentScore,
        t: Math.round(elapsedTimeMs)
      });
    },

    update(elapsedTimeMs, currentScore) {
      if (!isEnabled || replayTrail.length === 0) return;

      // Find the ghost position corresponding to current elapsed game time
      while (replayIndex < replayTrail.length - 1 && replayTrail[replayIndex].t < elapsedTimeMs) {
        replayIndex++;
      }

      if (replayIndex < replayTrail.length) {
        const pt = replayTrail[replayIndex];
        currentDelta = currentScore - (pt.score || 0);

        // Build a short 4-segment trailing phantom body for the ghost
        replaySnake = [];
        const bodyLen = 5;
        for (let i = 0; i < bodyLen; i++) {
          const idx = Math.max(0, replayIndex - i);
          replaySnake.push({ x: replayTrail[idx].x, y: replayTrail[idx].y });
        }
      }
    },

    getScoreDelta() {
      if (!isEnabled || replayTrail.length === 0) return null;
      return currentDelta;
    },

    endRun(mode = 'classic', finalScore = 0) {
      isRecording = false;
      if (recordedTrail.length > 10 && typeof Storage !== 'undefined') {
        Storage.saveGhostRun(mode, {
          score: finalScore,
          trail: recordedTrail
        });
      }
    },

    // Draw translucent phantom rival snake on canvas
    draw(ctx, cellSize) {
      if (!isEnabled || replaySnake.length === 0) return;

      const half = cellSize / 2;

      ctx.save();
      ctx.globalAlpha = 0.38; // Translucent phantom style

      // Draw ghost segments
      for (let i = replaySnake.length - 1; i >= 0; i--) {
        const pt = replaySnake[i];
        const cx = pt.x * cellSize + half;
        const cy = pt.y * cellSize + half;
        const radius = cellSize * (i === 0 ? 0.44 : 0.35);

        ctx.fillStyle = (i === 0) ? '#C4B5FD' : '#E9D5FF';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Ghost Head Details (cute hollow eyes)
        if (i === 0) {
          ctx.fillStyle = '#6D28D9';
          ctx.beginPath();
          ctx.arc(cx - radius * 0.3, cy - radius * 0.15, 2.2, 0, Math.PI * 2);
          ctx.arc(cx + radius * 0.3, cy - radius * 0.15, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }
  };
})();
