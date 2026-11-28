/**
 * NEON SNAKE - UI Controller & DOM Manager
 * Handles multi-mode selection, theme customizer, full settings panel,
 * player statistics dashboard, HUD, overlays, modals, and mobile touch bindings.
 */

const UI = (() => {
  const els = {};

  let heroAnimationId = null;
  let countdownTimerId = null;
  let lastTimerText = '';
  let lastTimerUrgent = null;
  let lastBonusVisible = null;
  let lastBonusPct = -1;
  let lastPowerUpHtml = '';
  let lastPowerUpVisible = null;
  let lastGhostText = '';
  let lastGhostVisible = null;
  let lastMissionText = '';
  let lastMissionPct = -1;
  let lastMissionVisible = null;

  const cacheElements = () => {
    // Screens
    els.screenHome = document.getElementById('screen-home');
    els.screenGame = document.getElementById('screen-game');

    // Player Profile & Name Modal
    els.playerProfilePill = document.getElementById('btn-open-name-modal');
    els.playerProfileName = document.getElementById('player-profile-name');
    els.homeGreetingName = document.getElementById('home-greeting-name');
    els.modalEditName = document.getElementById('modal-edit-name');
    els.inputPlayerName = document.getElementById('input-player-name');
    els.btnSavePlayerName = document.getElementById('btn-save-player-name');

    // Home Mode Cards & Badges
    els.cardBadgeInfinity = document.getElementById('card-badge-infinity');
    els.cardBadgeClassic = document.getElementById('card-badge-classic');
    els.cardBadgeTime = document.getElementById('card-badge-time');
    els.cardBadgeObstacle = document.getElementById('card-badge-obstacle');

    // Home elements
    els.homeModeBanner = document.getElementById('home-mode-banner');
    els.homeModeIcon = document.getElementById('home-mode-icon');
    els.homeModeBadge = document.getElementById('home-mode-badge');
    els.homeModeBest = document.getElementById('home-mode-best-val');
    els.homeModeTitle = document.getElementById('home-mode-title');
    els.homeModeDesc = document.getElementById('home-mode-desc');
    els.btnBannerModes = document.getElementById('btn-banner-modes');

    els.diffPicker = document.getElementById('home-difficulty-picker');
    els.diffButtons = document.querySelectorAll('.diff-btn');
    els.btnPlayGame = document.getElementById('btn-play-game');

    // Home Nav
    els.btnOpenModes = document.getElementById('btn-open-modes');
    els.btnOpenThemes = document.getElementById('btn-open-themes');
    els.btnOpenSettings = document.getElementById('btn-open-settings');
    els.btnOpenStats = document.getElementById('btn-open-stats');
    els.btnOpenHowTo = document.getElementById('btn-open-how-to');
    els.btnOpenLeaderboard = document.getElementById('btn-open-leaderboard');
    els.btnOpenAchievements = document.getElementById('btn-open-achievements');
    els.btnToggleSound = document.getElementById('btn-toggle-sound');
    els.btnToggleMusic = document.getElementById('btn-toggle-music');
    els.btnHomeFullscreen = document.getElementById('btn-home-fullscreen');
    els.heroCanvas = document.getElementById('hero-canvas');

    // Loading screen elements
    els.screenLoading = document.getElementById('screen-loading');
    els.loadingCanvas = document.getElementById('loading-canvas');
    els.loadingBarFill = document.getElementById('loading-bar-fill');
    els.loadingPercentText = document.getElementById('loading-percent-text');
    els.loadingStatusText = document.getElementById('loading-status-text');
    els.btnSkipLoading = document.getElementById('btn-skip-loading');

    // HUD elements
    els.hudModeVal = document.getElementById('hud-mode-val');
    els.hudScore = document.getElementById('hud-score-val');
    els.hudBest = document.getElementById('hud-best-val');
    els.hudLevelContainer = document.getElementById('hud-level-container');
    els.hudLevelLabel = document.getElementById('hud-level-label');
    els.hudLevel = document.getElementById('hud-level-val');
    els.hudTimerContainer = document.getElementById('hud-timer-container');
    els.hudTimerVal = document.getElementById('hud-timer-val');
    els.hudObstacleContainer = document.getElementById('hud-obstacle-container');
    els.hudObstacleVal = document.getElementById('hud-obstacle-val');
    els.hudSpeed = document.getElementById('hud-speed-val');

    els.btnHudPause = document.getElementById('btn-hud-pause');
    els.btnHudRestart = document.getElementById('btn-hud-restart');
    els.btnHudSound = document.getElementById('btn-hud-sound');
    els.btnHudMusic = document.getElementById('btn-hud-music');
    els.btnHudFullscreen = document.getElementById('btn-hud-fullscreen');

    // Overlays
    els.countdownOverlay = document.getElementById('countdown-overlay');
    els.countdownText = document.getElementById('countdown-text');
    els.pauseOverlay = document.getElementById('pause-overlay');
    els.btnResume = document.getElementById('btn-resume');
    els.btnPauseRestart = document.getElementById('btn-pause-restart');
    els.btnPauseQuit = document.getElementById('btn-pause-quit');

    // Obstacle Level Clear
    els.levelclearOverlay = document.getElementById('levelclear-overlay');
    els.levelclearTitle = document.getElementById('levelclear-title');
    els.levelclearSubtitle = document.getElementById('levelclear-subtitle');
    els.btnNextLevel = document.getElementById('btn-next-level');

    // Game Over Overlay
    els.gameoverOverlay = document.getElementById('gameover-overlay');
    els.gameoverModeBadge = document.getElementById('gameover-mode-badge');
    els.gameoverNewRecord = document.getElementById('gameover-new-record');
    els.gameoverScore = document.getElementById('gameover-score-val');
    els.gameoverBest = document.getElementById('gameover-best-val');
    els.gameoverFood = document.getElementById('gameover-food-val');
    els.gameoverTimeLabel = document.getElementById('gameover-time-label');
    els.gameoverTime = document.getElementById('gameover-time-val');
    els.btnPlayAgain = document.getElementById('btn-play-again');
    els.btnGameoverModes = document.getElementById('btn-gameover-modes');
    els.btnGameoverHome = document.getElementById('btn-gameover-home');

    // Bonus Banner
    els.bonusBanner = document.getElementById('bonus-banner');
    els.bonusTimerFill = document.getElementById('bonus-timer-fill');

    // Modals
    els.modalModes = document.getElementById('modal-modes');
    els.modesGrid = document.getElementById('modes-grid');

    els.modalThemes = document.getElementById('modal-themes');
    els.themesGrid = document.getElementById('themes-grid');
    els.btnThemeReset = document.getElementById('btn-theme-reset');

    els.modalSettings = document.getElementById('modal-settings');
    els.settingSoundEnabled = document.getElementById('setting-sound-enabled');
    els.settingSfxEnabled = document.getElementById('setting-sfx-enabled');
    els.settingBgmEnabled = document.getElementById('setting-bgm-enabled');
    els.settingVolume = document.getElementById('setting-volume');
    els.volumeValDisplay = document.getElementById('volume-val-display');

    els.settingSpeedMod = document.getElementById('setting-speed-mod');
    els.speedModDisplay = document.getElementById('speed-mod-display');
    els.settingShowGrid = document.getElementById('setting-show-grid');
    els.settingShowParticles = document.getElementById('setting-show-particles');

    els.settingVibration = document.getElementById('setting-vibration');
    els.pickerDpadSize = document.getElementById('picker-dpad-size');
    els.pickerControlLayout = document.getElementById('picker-control-layout');

    els.btnSettingsFullscreen = document.getElementById('btn-settings-fullscreen');
    els.settingHighQuality = document.getElementById('setting-high-quality');
    els.btnSettingsClearScores = document.getElementById('btn-settings-clear-scores');
    els.btnSettingsResetAll = document.getElementById('btn-settings-reset-all');

    els.modalStats = document.getElementById('modal-stats');
    els.statsOverviewGrid = document.getElementById('stats-overview-grid');
    els.statsModeBestGrid = document.getElementById('stats-mode-best-grid');
    els.btnResetStats = document.getElementById('btn-reset-stats');

    els.modalHowTo = document.getElementById('modal-how-to');
    els.modalLeaderboard = document.getElementById('modal-leaderboard');
    els.modalAchievements = document.getElementById('modal-achievements');
    els.leaderboardRows = document.getElementById('leaderboard-rows');
    els.leaderboardEmpty = document.getElementById('leaderboard-empty');
    els.btnClearLeaderboard = document.getElementById('btn-clear-leaderboard');
    els.achieveCount = document.getElementById('achieve-count');
    els.achieveProgressFill = document.getElementById('achieve-progress-fill');
    els.achievementsList = document.getElementById('achievements-list');
    els.toastContainer = document.getElementById('toast-container');

    // Controls
    els.mobileControls = document.getElementById('mobile-controls');
    els.dpadUp = document.getElementById('dpad-up');
    els.dpadDown = document.getElementById('dpad-down');
    els.dpadLeft = document.getElementById('dpad-left');
    els.dpadRight = document.getElementById('dpad-right');
  };

  // Setup prominent animated cartoon mascot showcase on loading screen
  const initHeroCanvas = () => {
    const canvas = els.loadingCanvas || els.heroCanvas;
    if (!canvas) return;
    canvas.width = 600;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    let t = 0;

    // Environmental decorative elements
    const clouds = [
      { x: 50, y: 32, scale: 0.9, speed: 0.22 },
      { x: 260, y: 22, scale: 1.25, speed: 0.28 },
      { x: 480, y: 38, scale: 0.8, speed: 0.18 }
    ];

    const stars = [
      { x: 80, y: 70, size: 4, phase: 0 },
      { x: 210, y: 40, size: 5, phase: 1.8 },
      { x: 350, y: 65, size: 3.5, phase: 3.2 },
      { x: 440, y: 30, size: 4.5, phase: 4.5 },
      { x: 540, y: 75, size: 3.8, phase: 5.7 }
    ];

    const leaves = [
      { x: 120, y: 80, speed: 0.45, rotSpeed: 0.02, rot: 0, amp: 14, phase: 0 },
      { x: 340, y: 95, speed: 0.38, rotSpeed: 0.025, rot: 1.2, amp: 18, phase: 2 },
      { x: 520, y: 70, speed: 0.42, rotSpeed: 0.018, rot: 2.5, amp: 12, phase: 4 }
    ];

    // Interactive fruit and particles
    let fruit = { x: 380, y: 130, eaten: false, respawnTimer: 0, scale: 1 };
    const particles = [];
    let floatText = null;
    let chewTimer = 0;

    const spawnFruit = (minX) => {
      fruit.x = minX + 220 + Math.random() * 120;
      fruit.y = 125 + Math.sin(fruit.x * 0.022) * 18;
      fruit.eaten = false;
      fruit.scale = 0;
    };

    const renderHero = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Lush Pastel Landscape Environment
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#E0F2FE');
      skyGrad.addColorStop(0.55, '#F0FDF4');
      skyGrad.addColorStop(1, '#DCFCE7');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sun glow in upper right
      const sunGrad = ctx.createRadialGradient(530, 25, 5, 530, 25, 75);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
      sunGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.25)');
      sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(530, 25, 75, 0, Math.PI * 2);
      ctx.fill();

      // Background gentle rolling hills
      ctx.fillStyle = '#BBF7D0';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(0, 160);
      ctx.bezierCurveTo(150, 140, 280, 175, 420, 150);
      ctx.bezierCurveTo(490, 138, 560, 148, canvas.width, 142);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Foreground lush meadow hill
      ctx.fillStyle = '#86EFAC';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(0, 185);
      ctx.bezierCurveTo(120, 170, 240, 192, 380, 175);
      ctx.bezierCurveTo(480, 162, 550, 182, canvas.width, 172);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Daisies & grass tufts along meadow
      const flowers = [70, 180, 290, 410, 520];
      flowers.forEach((fx, fi) => {
        const fy = 176 + Math.sin(fx * 0.05 + fi) * 8;
        const sway = Math.sin(t * 2.5 + fi) * 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(fx + sway - 2.5, fy, 2.5, 0, Math.PI * 2);
        ctx.arc(fx + sway + 2.5, fy, 2.5, 0, Math.PI * 2);
        ctx.arc(fx + sway, fy - 2.5, 2.5, 0, Math.PI * 2);
        ctx.arc(fx + sway, fy + 2.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(fx + sway, fy, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Floating Clouds (Drifting smoothly)
      clouds.forEach(cloud => {
        cloud.x += cloud.speed;
        if (cloud.x > canvas.width + 80) cloud.x = -80;

        ctx.save();
        ctx.translate(cloud.x, cloud.y);
        ctx.scale(cloud.scale, cloud.scale);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.shadowColor = 'rgba(186, 230, 253, 0.4)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(-22, 0, 15, 0, Math.PI * 2);
        ctx.arc(0, -9, 20, 0, Math.PI * 2);
        ctx.arc(22, 0, 15, 0, Math.PI * 2);
        ctx.arc(0, 6, 17, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // 3. Twinkling Golden Stars
      stars.forEach(st => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 3.5 + st.phase);
        ctx.save();
        ctx.translate(st.x, st.y);
        ctx.fillStyle = `rgba(245, 158, 11, ${0.4 + 0.5 * pulse})`;
        ctx.beginPath();
        const r = st.size * (0.8 + 0.4 * pulse);
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // 4. Floating Breeze Leaves
      leaves.forEach(leaf => {
        leaf.x += leaf.speed;
        leaf.rot += leaf.rotSpeed;
        if (leaf.x > canvas.width + 40) leaf.x = -30;
        const leafY = leaf.y + Math.sin(t * 2 + leaf.phase) * leaf.amp;

        ctx.save();
        ctx.translate(leaf.x, leafY);
        ctx.rotate(leaf.rot);
        ctx.fillStyle = '#4ADE80';
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Interactive Fruit & Collision
      if (!fruit.eaten) {
        if (fruit.scale < 1) fruit.scale = Math.min(1, fruit.scale + 0.05);

        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        ctx.scale(fruit.scale, fruit.scale);
        const floatBob = Math.sin(t * 4) * 3;

        // Ground shadow under fruit
        ctx.fillStyle = 'rgba(22, 101, 52, 0.18)';
        ctx.beginPath();
        ctx.ellipse(0, 16, 12, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Strawberry body
        ctx.translate(0, floatBob);
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.bezierCurveTo(12, -11, 14, 5, 0, 14);
        ctx.bezierCurveTo(-14, 5, -12, -11, 0, -11);
        ctx.closePath();
        ctx.fill();

        // Strawberry seeds
        ctx.fillStyle = '#FEF08A';
        [[-4, -3], [4, -3], [0, 3], [-3, 7], [3, 7]].forEach(([sx, sy]) => {
          ctx.beginPath();
          ctx.arc(sx, sy, 1.1, 0, Math.PI * 2);
          ctx.fill();
        });

        // Glossy fruit shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.beginPath();
        ctx.ellipse(-4, -5, 3.5, 1.8, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Green strawberry leaves on top
        ctx.fillStyle = '#22C55E';
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(-7, -15);
        ctx.lineTo(-2, -12);
        ctx.lineTo(0, -17);
        ctx.lineTo(2, -12);
        ctx.lineTo(7, -15);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      } else {
        fruit.respawnTimer--;
      }

      // 6. Cartoon Green Snake Mascot Animation
      const segments = 14;
      const spacing = 18;
      const snakeLength = segments * spacing;
      const loopWidth = canvas.width + snakeLength + 120;
      const headOffset = ((t * 68) % loopWidth + loopWidth) % loopWidth;
      const headX = headOffset - 60;
      const centerY = 125;

      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const segX = headX - (i * spacing);
        const segY = centerY + Math.sin(segX * 0.024 + t * 2.8) * 20;
        pts.push({ x: segX, y: segY });
      }

      const headPt = pts[0];
      const prevPt = pts[1] || headPt;
      const headAngle = Math.atan2(headPt.y - prevPt.y, headPt.x - prevPt.x);

      // Check fruit proximity
      const distToFruit = (!fruit.eaten) ? Math.hypot(headPt.x - fruit.x, headPt.y - fruit.y) : 999;
      let mouthOpen = 0;
      if (!fruit.eaten && distToFruit < 55) {
        mouthOpen = Math.min(1, (55 - distToFruit) / 35);
      }

      // Check eating collision
      if (!fruit.eaten && distToFruit < 18) {
        fruit.eaten = true;
        fruit.respawnTimer = 160;
        chewTimer = 65;

        // Sparkle burst particles
        for (let k = 0; k < 10; k++) {
          const pAngle = (k / 10) * Math.PI * 2;
          const pSpeed = 2 + Math.random() * 2.5;
          particles.push({
            x: fruit.x,
            y: fruit.y,
            vx: Math.cos(pAngle) * pSpeed,
            vy: Math.sin(pAngle) * pSpeed - 1.2,
            color: (k % 2 === 0) ? '#EF4444' : '#FBBF24',
            size: 3.5 + Math.random() * 2.5,
            life: 30,
            maxLife: 30
          });
        }

        // Floating "+10" score bubble
        floatText = { text: '+10', x: fruit.x, y: fruit.y - 14, alpha: 1.0 };
      }

      if (fruit.eaten && fruit.respawnTimer <= 0) {
        spawnFruit(headX);
      }

      if (chewTimer > 0) chewTimer--;

      // Render burst particles
      for (let pIdx = particles.length - 1; pIdx >= 0; pIdx--) {
        const p = particles[pIdx];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.life--;
        const pAlpha = p.life / p.maxLife;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = pAlpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pAlpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (p.life <= 0) particles.splice(pIdx, 1);
      }

      // Render floating "+10" text
      if (floatText) {
        floatText.y -= 0.8;
        floatText.alpha -= 0.022;
        if (floatText.alpha > 0) {
          ctx.save();
          ctx.font = '800 16px "Outfit", sans-serif';
          ctx.fillStyle = `rgba(34, 197, 94, ${floatText.alpha})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = 6;
          ctx.fillText(floatText.text, floatText.x - 12, floatText.y);
          ctx.restore();
        } else {
          floatText = null;
        }
      }

      // Draw Continuous Seamless Cartoon Body Bridge
      for (let i = segments; i > 0; i--) {
        const p1 = pts[i];
        const p2 = pts[i - 1];
        if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > spacing * 2.2) continue;

        const bodyWidth = 26 * (1 - (i / (segments + 4)) * 0.45);

        ctx.save();
        ctx.shadowColor = 'rgba(22, 101, 52, 0.18)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 5;

        // Bottom shade layer
        ctx.strokeStyle = '#26850E';
        ctx.lineWidth = bodyWidth + 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Main juicy green body layer
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#4ECB23';
        ctx.lineWidth = bodyWidth;
        ctx.stroke();

        // Cream yellow underbelly line
        ctx.strokeStyle = '#FFF3A3';
        ctx.lineWidth = bodyWidth * 0.42;
        ctx.stroke();

        ctx.restore();
      }

      // Draw Plump 3D Cartoon Segments & Head
      const pal = {
        crest: '#85EA46',
        body: '#4ECB23',
        shade: '#26850E',
        belly: '#FFF3A3',
        blush: '#FF7E98',
        tongue: '#FF6B8B',
        eyePupil: '#1E1B24'
      };

      for (let i = segments; i >= 0; i--) {
        const pt = pts[i];
        const isHead = (i === 0);
        const taper = 1 - (i / segments) * 0.58;
        const radius = isHead ? 17 : Math.max(5.5, 14 * taper);

        ctx.save();
        ctx.translate(pt.x, pt.y);

        if (isHead) {
          ctx.rotate(headAngle);

          // Subtle squash & stretch during chew
          if (chewTimer > 0) {
            const chewBounce = Math.sin(chewTimer * 0.35) * 0.14;
            ctx.scale(1.0 - chewBounce, 1.0 + chewBounce);
          }

          // Animated pink tongue
          const tongueCycle = Math.sin(t * 10);
          if (mouthOpen < 0.2 && chewTimer === 0 && tongueCycle > 0.45) {
            ctx.save();
            ctx.strokeStyle = pal.tongue;
            ctx.lineWidth = 2.4;
            ctx.lineCap = 'round';
            const tLen = 12 + Math.sin(t * 24) * 2;
            ctx.beginPath();
            ctx.moveTo(radius + 2, 0);
            ctx.lineTo(radius + tLen, 0);
            ctx.lineTo(radius + tLen + 4, -3);
            ctx.moveTo(radius + tLen, 0);
            ctx.lineTo(radius + tLen + 4, 3);
            ctx.stroke();
            ctx.restore();
          }

          // Cartoon Green Head Base
          ctx.shadowColor = 'rgba(22, 101, 52, 0.22)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 4;

          const headGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.3, 2, 0, 0, radius * 1.3);
          headGrad.addColorStop(0, pal.crest);
          headGrad.addColorStop(0.5, pal.body);
          headGrad.addColorStop(1, pal.shade);

          ctx.fillStyle = headGrad;
          ctx.beginPath();
          ctx.ellipse(2, 0, radius * 1.3, radius, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.strokeStyle = pal.shade;
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Light Cream-Yellow Belly on Head Bottom
          ctx.fillStyle = pal.belly;
          ctx.beginPath();
          ctx.ellipse(0, radius * 0.38, radius * 0.9, radius * 0.45, 0, 0, Math.PI);
          ctx.fill();

          // Rosy Pink Blush Cheeks
          ctx.fillStyle = (chewTimer > 0) ? '#FF5C80' : pal.blush;
          [-1, 1].forEach(side => {
            ctx.beginPath();
            ctx.ellipse(radius * 0.05, radius * 0.62 * side, 5, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();
          });

          // Small Nostrils
          ctx.fillStyle = 'rgba(38, 133, 14, 0.65)';
          [-1, 1].forEach(side => {
            ctx.beginPath();
            ctx.arc(radius * 0.85, 3.2 * side, 1.3, 0, Math.PI * 2);
            ctx.fill();
          });

          // Mouth & Smile / Eating Chomp
          if (mouthOpen > 0.2 || chewTimer > 0) {
            const openAmt = Math.max(mouthOpen, (chewTimer > 0 ? 0.6 : 0));
            ctx.fillStyle = '#991B1B';
            ctx.beginPath();
            ctx.ellipse(radius * 0.7, 0, 6 * openAmt, 5 * openAmt, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(radius * 0.7, -3 * openAmt, 1.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.strokeStyle = '#26850E';
            ctx.lineWidth = 1.6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(radius * 0.55, 0, 5, -Math.PI / 3, Math.PI / 3);
            ctx.stroke();
          }

          // Large Expressive Anime Cartoon Eyes
          const blinkCycle = (t * 60) % 220;
          const isBlinking = blinkCycle < 10;
          const isHappy = (chewTimer > 0);

          [-1, 1].forEach(side => {
            const eyeX = radius * 0.32;
            const eyeY = radius * 0.44 * side;
            const eyeRadius = 6.2;

            if (isHappy) {
              ctx.strokeStyle = pal.eyePupil;
              ctx.lineWidth = 2.4;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(eyeX, eyeY, eyeRadius * 0.75, Math.PI * 1.15, Math.PI * 1.85);
              ctx.stroke();
            } else if (isBlinking) {
              ctx.strokeStyle = pal.eyePupil;
              ctx.lineWidth = 2.2;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.arc(eyeX, eyeY, eyeRadius * 0.7, 0.2, Math.PI - 0.2);
              ctx.stroke();
            } else {
              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
              ctx.fill();

              const pupilOffset = mouthOpen > 0.3 ? 1.2 : 0.4;
              ctx.fillStyle = pal.eyePupil;
              ctx.beginPath();
              ctx.arc(eyeX + pupilOffset, eyeY, eyeRadius * 0.75, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.arc(eyeX + pupilOffset - 1.8, eyeY - 1.8 * side, 2.2, 0, Math.PI * 2);
              ctx.arc(eyeX + pupilOffset + 1.8, eyeY + 1.8 * side, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
          });

          // Snout Top Gloss Shine
          ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
          ctx.beginPath();
          ctx.ellipse(radius * 0.4, 0, 6, 2.8, 0, 0, Math.PI * 2);
          ctx.fill();

        } else {
          // Plump 3D Body Segment with Radial Green Gradient
          const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.3, 1, 0, 0, radius);
          grad.addColorStop(0, pal.crest);
          grad.addColorStop(0.5, pal.body);
          grad.addColorStop(1, pal.shade);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(0, 0, radius * 1.15, radius, 0, 0, Math.PI * 2);
          ctx.fill();

          // Light Cream-Yellow Belly Arc
          ctx.fillStyle = pal.belly;
          ctx.beginPath();
          ctx.ellipse(0, radius * 0.34, radius * 0.78, radius * 0.4, 0, 0, Math.PI);
          ctx.fill();

          // Glossy Curved Specular Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.beginPath();
          ctx.ellipse(-radius * 0.25, -radius * 0.4, radius * 0.42, radius * 0.2, -Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();

          // Tapered rounded tail tip
          if (i === segments) {
            const prev = pts[segments - 1] || pt;
            const tailAngle = Math.atan2(pt.y - prev.y, pt.x - prev.x);
            ctx.save();
            ctx.rotate(tailAngle);
            ctx.fillStyle = pal.body;
            ctx.beginPath();
            ctx.moveTo(0, -radius * 0.4);
            ctx.lineTo(-radius * 1.6, 0);
            ctx.lineTo(0, radius * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.restore();
      }

      t += 0.018;
      heroAnimationId = requestAnimationFrame(renderHero);
    };

    if (heroAnimationId) cancelAnimationFrame(heroAnimationId);
    renderHero();
  };

  // Full-Screen Mascot Loading Sequence State & Controller
  let loadingCompleted = false;

  const completeLoadingScreen = () => {
    if (loadingCompleted) return;
    loadingCompleted = true;

    if (els.loadingBarFill) els.loadingBarFill.style.width = '100%';
    if (els.loadingPercentText) els.loadingPercentText.textContent = '100%';
    if (els.loadingStatusText) els.loadingStatusText.textContent = 'Ready to Slither!';

    try {
      if (typeof SoundEngine !== 'undefined') {
        if (SoundEngine.playBonus) SoundEngine.playBonus();
        else if (SoundEngine.playClick) SoundEngine.playClick();
      }
    } catch (_) {}

    if (els.screenLoading) {
      els.screenLoading.classList.add('fade-out');
      setTimeout(() => {
        els.screenLoading.classList.add('is-hidden');
        if (heroAnimationId) {
          cancelAnimationFrame(heroAnimationId);
          heroAnimationId = null;
        }
      }, 450);
    }
  };

  const initLoadingSequence = () => {
    if (!els.screenLoading) return;

    let progress = 0;
    const tips = [
      { at: 0, text: 'Waking up the happy snake...' },
      { at: 22, text: 'Planting fresh strawberries...' },
      { at: 48, text: 'Preparing Adventure Worlds...' },
      { at: 74, text: 'Polishing candy & ice mazes...' },
      { at: 94, text: 'Ready to Slither!' }
    ];

    const startTime = performance.now();
    const duration = 3800; // Comfortable ~3.8s casual arcade loading speed

    const updateLoader = (now) => {
      if (loadingCompleted) return;
      const elapsed = now - startTime;
      const tNorm = Math.min(1, elapsed / duration);
      // Smooth natural progression curve
      progress = Math.min(100, Math.round((1 - Math.pow(1 - tNorm, 1.6)) * 100));

      if (els.loadingBarFill) {
        els.loadingBarFill.style.width = `${progress}%`;
      }
      if (els.loadingPercentText) {
        els.loadingPercentText.textContent = `${progress}%`;
      }

      // Update friendly loading message
      for (let i = tips.length - 1; i >= 0; i--) {
        if (progress >= tips[i].at) {
          if (els.loadingStatusText && els.loadingStatusText.textContent !== tips[i].text) {
            els.loadingStatusText.textContent = tips[i].text;
          }
          break;
        }
      }

      if (tNorm < 1) {
        requestAnimationFrame(updateLoader);
      } else {
        setTimeout(completeLoadingScreen, 260);
      }
    };

    requestAnimationFrame(updateLoader);

    // Skip loading on click or tap
    if (els.btnSkipLoading) {
      els.btnSkipLoading.addEventListener('click', (e) => {
        e.stopPropagation();
        completeLoadingScreen();
      });
    }

    els.screenLoading.addEventListener('click', () => {
      completeLoadingScreen();
    });
  };

  return {
    init() {
      cacheElements();
      this.updatePlayerProfile();
      this.updateCoinsDisplay();
      this.updateEvolutionDisplay();
      this.applySavedSettings();
      this.updateHomeModeBanner();
      this.updateBestScoreDisplay();
      this.updateSoundToggles();
      initLoadingSequence();
      this.bindEvents();
      if (typeof DailySystem !== 'undefined') {
        DailySystem.init();
        this.updateStreakDisplay();
      }
    },

    // Refresh player profile name across home header and greeting
    updatePlayerProfile() {
      const name = (typeof Storage !== 'undefined' && Storage.getPlayerName)
        ? Storage.getPlayerName()
        : 'Player 1';
      if (els.playerProfileName) els.playerProfileName.textContent = name;
      if (els.homeGreetingName) els.homeGreetingName.textContent = name;
    },

    // Apply stored user settings to DOM & sound engine
    applySavedSettings() {
      const settings = Storage.getSettings();

      // Audio
      if (els.settingSoundEnabled) els.settingSoundEnabled.checked = settings.soundEnabled;
      if (els.settingSfxEnabled) els.settingSfxEnabled.checked = settings.sfxEnabled;
      if (els.settingBgmEnabled) els.settingBgmEnabled.checked = settings.bgmEnabled;
      if (els.settingVolume) {
        const volPct = Math.round((settings.volume ?? 0.8) * 100);
        els.settingVolume.value = volPct;
        if (els.volumeValDisplay) els.volumeValDisplay.textContent = `${volPct}%`;
      }

      // Gameplay
      if (els.settingSpeedMod) {
        const modPct = Math.round((settings.snakeSpeedModifier ?? 1.0) * 100);
        els.settingSpeedMod.value = modPct;
        if (els.speedModDisplay) els.speedModDisplay.textContent = `${(modPct / 100).toFixed(1)}x`;
      }
      if (els.settingShowGrid) els.settingShowGrid.checked = settings.showGrid !== false;
      if (els.settingShowParticles) els.settingShowParticles.checked = settings.showParticles !== false;

      // Mobile
      if (els.settingVibration) els.settingVibration.checked = settings.vibration !== false;
      this.updateSegmentedPicker(els.pickerDpadSize, settings.touchControlSize || 'normal');
      this.updateSegmentedPicker(els.pickerControlLayout, settings.controlLayout || 'both');

      // Control size CSS class
      if (els.mobileControls) {
        els.mobileControls.classList.remove('size-compact', 'size-normal', 'size-large');
        els.mobileControls.classList.add(`size-${settings.touchControlSize || 'normal'}`);
      }
    },

    updateSegmentedPicker(container, value) {
      if (!container) return;
      container.querySelectorAll('.seg-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-val') === value);
      });
    },

    bindEvents() {
      // Home Screen Mode Cards Interaction
      document.querySelectorAll('.home-card-item[data-mode]').forEach(card => {
        card.addEventListener('click', () => {
          try { SoundEngine.playClick(); } catch (_) {}
          const modeId = card.getAttribute('data-mode');
          if (modeId && typeof GameModes !== 'undefined') {
            GameModes.setMode(modeId);
            this.updateHomeModeBanner();
            this.updateBestScoreDisplay();
          }
        });
      });

      // Player Profile Name Edit Interactions
      if (els.playerProfilePill) {
        els.playerProfilePill.addEventListener('click', () => {
          try { SoundEngine.playClick(); } catch (_) {}
          if (els.inputPlayerName) {
            els.inputPlayerName.value = Storage.getPlayerName();
          }
          this.openModal('modal-edit-name');
          if (els.inputPlayerName) {
            setTimeout(() => els.inputPlayerName.focus(), 100);
          }
        });
      }

      if (els.btnSavePlayerName) {
        els.btnSavePlayerName.addEventListener('click', () => {
          try { SoundEngine.playClick(); } catch (_) {}
          const val = els.inputPlayerName ? els.inputPlayerName.value : '';
          const saved = Storage.savePlayerName(val);
          this.updatePlayerProfile();
          this.closeModal('modal-edit-name');
          this.showToast({ icon: '<svg viewBox="0 0 24 24" class="toast-svg"><path fill="#FFE987" d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"/></svg>', title: 'Profile Updated', desc: `Welcome, ${saved}!` });
        });
      }

      if (els.inputPlayerName) {
        els.inputPlayerName.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (els.btnSavePlayerName) els.btnSavePlayerName.click();
          }
        });
      }

      // Difficulty Selector
      els.diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          SoundEngine.playClick();
          els.diffButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-checked', 'true');
          const diff = btn.getAttribute('data-diff');
          Storage.saveSettings({ difficulty: diff });
        });
      });

      // Audio (Snake Voice & SFX) toggle
      const toggleAudio = () => {
        const settings = Storage.getSettings();
        const currentlyOn = settings.soundEnabled !== false && settings.sfxEnabled !== false;
        const nextState = !currentlyOn;
        const patch = nextState
          ? { soundEnabled: true, sfxEnabled: true }
          : { sfxEnabled: false };
        Storage.saveSettings(patch);
        if (nextState) SoundEngine.setSoundEnabled(true);
        SoundEngine.setSfxEnabled(nextState);
        this.applySavedSettings();
        this.updateSoundToggles();
        if (nextState) SoundEngine.playSnakeHiss(0.18, 0.25);
      };

      // Background Music (BGM) toggle
      const toggleMusic = () => {
        const settings = Storage.getSettings();
        const currentlyOn = settings.soundEnabled !== false && settings.bgmEnabled !== false;
        const nextState = !currentlyOn;
        const patch = nextState
          ? { soundEnabled: true, bgmEnabled: true }
          : { bgmEnabled: false };
        Storage.saveSettings(patch);
        if (nextState) SoundEngine.setSoundEnabled(true);
        SoundEngine.setBgmEnabled(nextState);
        if (nextState && typeof Game !== 'undefined' && Game.isPlaying && Game.isPlaying()) {
          SoundEngine.startBGM();
        }
        this.applySavedSettings();
        this.updateSoundToggles();
        SoundEngine.playClick();
      };

      if (els.btnToggleSound) els.btnToggleSound.addEventListener('click', toggleAudio);
      if (els.btnHudSound) els.btnHudSound.addEventListener('click', toggleAudio);
      if (els.btnToggleMusic) els.btnToggleMusic.addEventListener('click', toggleMusic);
      if (els.btnHudMusic) els.btnHudMusic.addEventListener('click', toggleMusic);

      // Fullscreen Toggle
      const toggleFullscreen = () => {
        SoundEngine.playClick();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        }
      };

      if (els.btnHomeFullscreen) els.btnHomeFullscreen.addEventListener('click', toggleFullscreen);
      if (els.btnHudFullscreen) els.btnHudFullscreen.addEventListener('click', toggleFullscreen);
      if (els.btnSettingsFullscreen) els.btnSettingsFullscreen.addEventListener('click', toggleFullscreen);

      document.addEventListener('fullscreenchange', () => {
        const isFS = !!document.fullscreenElement;
        document.querySelectorAll('.icon-fullscreen-enter').forEach(i => i.classList.toggle('hide', isFS));
        document.querySelectorAll('.icon-fullscreen-exit').forEach(i => i.classList.toggle('hide', !isFS));
        setTimeout(() => Game.handleResize(), 80);
      });

      // Modal Open Handlers (with safe error handling)
      const safeTrigger = (btn, fn) => {
        if (!btn) return;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          fn();
        });
      };

      safeTrigger(els.btnBannerModes, () => this.openModesModal());
      safeTrigger(els.btnOpenModes, () => this.openModesModal());
      safeTrigger(els.btnOpenThemes, () => this.openThemesModal());
      safeTrigger(els.btnOpenSettings, () => this.openSettingsModal());
      safeTrigger(els.btnOpenStats, () => this.openStatsModal());
      safeTrigger(els.btnOpenHowTo, () => this.openHowToModal());
      safeTrigger(els.btnOpenLeaderboard, () => this.openLeaderboardModal());
      safeTrigger(els.btnOpenAchievements, () => this.openAchievementsModal());

      // Modal Close Handlers
      document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          try { SoundEngine.playClick(); } catch (_) {}
          const targetId = btn.getAttribute('data-close');
          const targetModal = document.getElementById(targetId) || btn.closest('.modal-backdrop');
          if (targetModal) this.closeModal(targetModal);
        });
      });

      document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            try { SoundEngine.playClick(); } catch (_) {}
            this.closeModal(modal);
          }
        });
      });

      // Settings: Tabs
      document.querySelectorAll('.settings-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          SoundEngine.playClick();
          document.querySelectorAll('.settings-tabs .tab-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
          });
          document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          const tabId = btn.getAttribute('data-tab');
          const pane = document.getElementById(tabId);
          if (pane) pane.classList.add('active');
        });
      });

      // Settings: Audio Controls
      if (els.settingSoundEnabled) {
        els.settingSoundEnabled.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          Storage.saveSettings({ soundEnabled: enabled });
          SoundEngine.setSoundEnabled(enabled);
          this.updateSoundToggles();
        });
      }

      if (els.settingSfxEnabled) {
        els.settingSfxEnabled.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          Storage.saveSettings({ sfxEnabled: enabled });
          SoundEngine.setSfxEnabled(enabled);
          this.updateSoundToggles();
        });
      }

      if (els.settingBgmEnabled) {
        els.settingBgmEnabled.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          Storage.saveSettings({ bgmEnabled: enabled });
          SoundEngine.setBgmEnabled(enabled);
          if (enabled && typeof Game !== 'undefined' && Game.isPlaying && Game.isPlaying()) {
            SoundEngine.startBGM();
          }
          this.updateSoundToggles();
        });
      }

      if (els.settingVolume) {
        els.settingVolume.addEventListener('input', (e) => {
          const val = Number(e.target.value);
          if (els.volumeValDisplay) els.volumeValDisplay.textContent = `${val}%`;
          const factor = val / 100;
          Storage.saveSettings({ volume: factor });
          SoundEngine.setVolume(factor);
        });
      }

      // Settings: Gameplay Controls
      if (els.settingSpeedMod) {
        els.settingSpeedMod.addEventListener('input', (e) => {
          const val = Number(e.target.value);
          const factor = val / 100;
          if (els.speedModDisplay) els.speedModDisplay.textContent = `${factor.toFixed(1)}x`;
          Storage.saveSettings({ snakeSpeedModifier: factor });
        });
      }

      if (els.settingShowGrid) {
        els.settingShowGrid.addEventListener('change', (e) => {
          Storage.saveSettings({ showGrid: e.target.checked });
        });
      }

      if (els.settingShowParticles) {
        els.settingShowParticles.addEventListener('change', (e) => {
          Storage.saveSettings({ showParticles: e.target.checked });
        });
      }

      // Settings: Mobile Options
      if (els.settingVibration) {
        els.settingVibration.addEventListener('change', (e) => {
          Storage.saveSettings({ vibration: e.target.checked });
          if (e.target.checked) SoundEngine.vibrate(30);
        });
      }

      if (els.pickerDpadSize) {
        els.pickerDpadSize.querySelectorAll('.seg-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            SoundEngine.playClick();
            const size = btn.getAttribute('data-val');
            this.updateSegmentedPicker(els.pickerDpadSize, size);
            Storage.saveSettings({ touchControlSize: size });
            if (els.mobileControls) {
              els.mobileControls.classList.remove('size-compact', 'size-normal', 'size-large');
              els.mobileControls.classList.add(`size-${size}`);
            }
          });
        });
      }

      if (els.pickerControlLayout) {
        els.pickerControlLayout.querySelectorAll('.seg-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            SoundEngine.playClick();
            const layout = btn.getAttribute('data-val');
            this.updateSegmentedPicker(els.pickerControlLayout, layout);
            Storage.saveSettings({ controlLayout: layout });
          });
        });
      }

      // Settings: Reset Buttons
      if (els.btnSettingsClearScores) {
        els.btnSettingsClearScores.addEventListener('click', () => {
          if (confirm('Clear all your local high scores and leaderboard entries?')) {
            Storage.clearLeaderboard();
            this.updateBestScoreDisplay();
            this.updateHomeModeBanner();
            this.showToast({ icon: '<svg viewBox="0 0 24 24" class="toast-svg"><path fill="#FF777D" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>', title: 'Scores Cleared', desc: 'All record scores have been reset.' });
          }
        });
      }

      if (els.btnSettingsResetAll) {
        els.btnSettingsResetAll.addEventListener('click', () => {
          if (confirm('Restore all settings to default values?')) {
            Storage.resetSettings();
            this.applySavedSettings();
            this.showToast({ icon: '<svg viewBox="0 0 24 24" class="toast-svg"><path fill="#A9EDB0" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>', title: 'Settings Reset', desc: 'Default preferences restored.' });
          }
        });
      }

      // Stats: Reset Button
      if (els.btnResetStats) {
        els.btnResetStats.addEventListener('click', () => {
          if (confirm('Reset all lifetime player statistics to zero?')) {
            Storage.resetStats();
            this.renderStats();
            this.showToast({ icon: '<svg viewBox="0 0 24 24" class="toast-svg"><path fill="#A9E7EC" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>', title: 'Stats Reset', desc: 'All gameplay metrics cleared.' });
          }
        });
      }

      // Theme Reset Button
      if (els.btnThemeReset) {
        els.btnThemeReset.addEventListener('click', () => {
          SoundEngine.playClick();
          Themes.apply('pastel-world');
          this.renderThemes();
        });
      }

      // Clear Leaderboard
      if (els.btnClearLeaderboard) {
        els.btnClearLeaderboard.addEventListener('click', () => {
          if (confirm('Are you sure you want to clear your local high scores?')) {
            Storage.clearLeaderboard();
            this.renderLeaderboard();
            this.updateBestScoreDisplay();
            this.updateHomeModeBanner();
          }
        });
      }

      // Mobile Touch feedback
      const bindTouch = (btn, action) => {
        if (!btn) return;
        const trigger = (e) => {
          e.preventDefault();
          SoundEngine.vibrate(12);
          btn.classList.add('touch-active');
          action();
        };

        const release = () => {
          btn.classList.remove('touch-active');
        };

        btn.addEventListener('touchstart', trigger, { passive: false });
        btn.addEventListener('touchend', release);
        btn.addEventListener('touchcancel', release);
        btn.addEventListener('mousedown', () => {
          btn.classList.add('touch-active');
          action();
        });
        btn.addEventListener('mouseup', release);
        btn.addEventListener('mouseleave', release);
      };

      bindTouch(els.dpadUp, () => Game.handleDirection({ x: 0, y: -1 }));
      bindTouch(els.dpadDown, () => Game.handleDirection({ x: 0, y: 1 }));
      bindTouch(els.dpadLeft, () => Game.handleDirection({ x: -1, y: 0 }));
      bindTouch(els.dpadRight, () => Game.handleDirection({ x: 1, y: 0 }));

      // Window resize
      window.addEventListener('resize', () => {
        Game.handleResize();
      });
      window.addEventListener('orientationchange', () => {
        setTimeout(() => Game.handleResize(), 150);
      });

      // Keyboard shortcuts
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-backdrop:not(.hide)').forEach(modal => {
            this.closeModal(modal);
          });
        }
        if (e.code === 'KeyF' && !e.ctrlKey && !e.altKey && !e.metaKey) {
          toggleFullscreen();
        }
      });
    },

    getSelectedDifficulty() {
      const active = document.querySelector('.diff-btn.active');
      return active ? active.getAttribute('data-diff') : 'medium';
    },

    setDifficulty(diff) {
      els.diffButtons.forEach(btn => {
        const matches = (btn.getAttribute('data-diff') === diff);
        btn.classList.toggle('active', matches);
        btn.setAttribute('aria-checked', matches ? 'true' : 'false');
      });
    },

    // Update Home Screen Mode Banner & Home Grid Cards
    updateHomeModeBanner() {
      const mode = GameModes.getCurrentMode();
      const best = Storage.getModeBestScore(mode.id);

      if (els.homeModeIcon) els.homeModeIcon.innerHTML = mode.icon;
      if (els.homeModeBadge) els.homeModeBadge.textContent = mode.badge;
      if (els.homeModeTitle) els.homeModeTitle.textContent = mode.name;
      if (els.homeModeDesc) els.homeModeDesc.textContent = mode.tagline;
      if (els.homeModeBest) els.homeModeBest.textContent = String(best).padStart(4, '0');

      // Sync active state across the 4 mode cards on home screen
      document.querySelectorAll('.home-card-item[data-mode]').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-mode') === mode.id);
      });

      // In Time Attack or Infinity mode, difficulty is secondary or fixed
      if (els.diffPicker) {
        els.diffPicker.style.display = (mode.id === 'timeAttack') ? 'none' : 'block';
      }
    },

    // Switch between Home and Game screens
    showScreen(screenName) {
      if (screenName === 'game') {
        els.screenHome.classList.remove('active');
        els.screenGame.classList.add('active');
        document.body.classList.add('in-game');
        window.scrollTo(0, 0);
        if (heroAnimationId) {
          cancelAnimationFrame(heroAnimationId);
          heroAnimationId = null;
        }
      } else {
        els.screenGame.classList.remove('active');
        els.screenHome.classList.add('active');
        document.body.classList.remove('in-game');
        window.scrollTo(0, 0);
        this.updatePlayerProfile();
        this.updateHomeModeBanner();
        this.updateBestScoreDisplay();
        if (!loadingCompleted) initHeroCanvas();
      }
    },

    // Audio (Voice/SFX) & Music toggle icon sync
    updateSoundToggles() {
      const sfxMuted = SoundEngine.isSfxMuted ? SoundEngine.isSfxMuted() : SoundEngine.isMuted();
      const bgmMuted = SoundEngine.isBgmMuted ? SoundEngine.isBgmMuted() : SoundEngine.isMuted();

      document.querySelectorAll('.icon-sound-on').forEach(icon => {
        icon.classList.toggle('hide', sfxMuted);
      });
      document.querySelectorAll('.icon-sound-off').forEach(icon => {
        icon.classList.toggle('hide', !sfxMuted);
      });
      if (els.btnToggleSound) els.btnToggleSound.classList.toggle('is-muted', sfxMuted);
      if (els.btnHudSound) els.btnHudSound.classList.toggle('is-muted', sfxMuted);

      document.querySelectorAll('.icon-music-on').forEach(icon => {
        icon.classList.toggle('hide', bgmMuted);
      });
      document.querySelectorAll('.icon-music-off').forEach(icon => {
        icon.classList.toggle('hide', !bgmMuted);
      });
      if (els.btnToggleMusic) els.btnToggleMusic.classList.toggle('is-muted', bgmMuted);
      if (els.btnHudMusic) els.btnHudMusic.classList.toggle('is-muted', bgmMuted);
    },

    // Best Score Display
    updateBestScoreDisplay() {
      const mode = GameModes.getCurrentMode();
      const best = Storage.getModeBestScore(mode.id);
      if (els.hudBest) els.hudBest.textContent = String(best);
      if (els.homeModeBest) els.homeModeBest.textContent = String(best).padStart(4, '0');

      // Update badges on all 4 mode cards on Home screen
      if (els.cardBadgeInfinity) els.cardBadgeInfinity.textContent = `Best: ${Storage.getModeBestScore('infinity')}`;
      if (els.cardBadgeClassic) els.cardBadgeClassic.textContent = `Best: ${Storage.getModeBestScore('classic')}`;
      if (els.cardBadgeTime) els.cardBadgeTime.textContent = `Best: ${Storage.getModeBestScore('timeAttack')}`;
      const stats = Storage.getStats();
      if (els.cardBadgeObstacle) els.cardBadgeObstacle.textContent = `Best: ${stats.obstacleLevelsCompleted || 0}`;
    },

    // Configure HUD for current mode
    setupHUDForMode(mode) {
      if (els.hudModeVal) els.hudModeVal.textContent = mode.badge;

      // Timer visibility for Time Attack
      if (els.hudTimerContainer) {
        els.hudTimerContainer.classList.toggle('hide', !mode.hasTimer);
      }

      // Obstacle visibility for Obstacle Mode
      if (els.hudObstacleContainer) {
        els.hudObstacleContainer.classList.toggle('hide', !mode.hasObstacles);
      }

      // Level / Stage label
      if (els.hudLevelLabel) {
        els.hudLevelLabel.textContent = mode.hasObstacles ? 'MAP' : 'LEVEL';
      }
    },

    // Live In-game HUD Updates
    updateHUD(score, level, speedMultiplier) {
      if (els.hudScore) els.hudScore.textContent = score;
      if (els.hudLevel) els.hudLevel.textContent = level;
      if (els.hudSpeed) els.hudSpeed.textContent = `${speedMultiplier.toFixed(1)}x`;
    },

    // Time Attack Timer Display (memoized to avoid per-frame DOM writes)
    updateTimer(secondsRemaining) {
      if (!els.hudTimerVal) return;
      const totalSecs = Math.max(0, Math.ceil(secondsRemaining));
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      const text = `${mins}:${String(secs).padStart(2, '0')}`;
      if (text !== lastTimerText) {
        lastTimerText = text;
        els.hudTimerVal.textContent = text;
      }
      const isUrgent = totalSecs <= 10;
      if (isUrgent !== lastTimerUrgent) {
        lastTimerUrgent = isUrgent;
        els.hudTimerVal.classList.toggle('timer-urgent', isUrgent);
      }
    },

    // Obstacle Mode Progress Display
    updateObstacleProgress(current, target) {
      if (els.hudObstacleVal) {
        els.hudObstacleVal.textContent = `${current}/${target}`;
      }
    },

    // Bonus Star Timer Bar (memoized to avoid per-frame DOM thrashing)
    updateBonusBar(remaining, maxTime) {
      const visible = remaining > 0;
      if (visible !== lastBonusVisible) {
        lastBonusVisible = visible;
        els.bonusBanner.classList.toggle('hide', !visible);
        if (!visible) lastBonusPct = -1;
      }
      if (visible) {
        const pct = Math.max(0, Math.min(100, Math.round((remaining / maxTime) * 100)));
        if (pct !== lastBonusPct) {
          lastBonusPct = pct;
          els.bonusTimerFill.style.width = `${pct}%`;
        }
      }
    },

    cancelCountdown() {
      if (countdownTimerId) {
        clearTimeout(countdownTimerId);
        countdownTimerId = null;
      }
      if (els.countdownOverlay) {
        els.countdownOverlay.classList.add('hide');
      }
    },

    // Countdown Overlay (3, 2, 1, GO!)
    showCountdown(count, onComplete) {
      this.cancelCountdown();
      els.countdownOverlay.classList.remove('hide');
      let current = count;

      const tick = () => {
        countdownTimerId = null;
        if (current > 0) {
          els.countdownText.textContent = current;
          els.countdownText.style.animation = 'none';
          void els.countdownText.offsetWidth; // Reflow
          els.countdownText.style.animation = 'countdownPop 0.85s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards';
          SoundEngine.playCountdown(false);
          current--;
          countdownTimerId = setTimeout(tick, 900);
        } else if (current === 0) {
          els.countdownText.textContent = 'GO!';
          els.countdownText.style.animation = 'none';
          void els.countdownText.offsetWidth;
          els.countdownText.style.animation = 'countdownPop 0.85s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards';
          SoundEngine.playCountdown(true);
          current--;
          countdownTimerId = setTimeout(tick, 750);
        } else {
          els.countdownOverlay.classList.add('hide');
          if (onComplete) onComplete();
        }
      };

      tick();
    },

    // Pause Overlay
    showPause(show) {
      els.pauseOverlay.classList.toggle('hide', !show);
    },

    // Obstacle Mode Level Clear Overlay
    showLevelClear(clearedLevel, nextMapName, onNext) {
      if (!els.levelclearOverlay) return;
      els.levelclearTitle.textContent = `SECTOR ${clearedLevel} CLEARED!`;
      els.levelclearSubtitle.textContent = `Next Challenge: Sector ${clearedLevel + 1} – ${nextMapName}`;
      els.levelclearOverlay.classList.remove('hide');

      const nextHandler = () => {
        SoundEngine.playClick();
        els.btnNextLevel.removeEventListener('click', nextHandler);
        this.hideLevelClear();
        if (onNext) onNext();
      };

      els.btnNextLevel.addEventListener('click', nextHandler, { once: true });
    },

    hideLevelClear() {
      if (els.levelclearOverlay) els.levelclearOverlay.classList.add('hide');
    },

    // Game Over Overlay
    showGameOver(stats, isNewRecord) {
      if (els.gameoverModeBadge) els.gameoverModeBadge.textContent = `${stats.mode.toUpperCase()}`;
      els.gameoverScore.textContent = stats.score;
      els.gameoverBest.textContent = stats.bestScore;
      els.gameoverFood.textContent = stats.foodEaten;
      els.gameoverTime.textContent = stats.timeString;

      if (stats.cause === 'timeout') {
        els.gameoverTimeLabel.textContent = 'TIME EXPIRED';
      } else {
        els.gameoverTimeLabel.textContent = 'SURVIVED';
      }

      els.gameoverNewRecord.classList.toggle('hide', !isNewRecord);
      els.gameoverOverlay.classList.remove('hide');
    },

    hideGameOver() {
      els.gameoverOverlay.classList.add('hide');
    },

    // Modal Control (Safe element/ID resolver with explicit display enforcement)
    openModal(target) {
      const modal = (typeof target === 'string') ? document.getElementById(target) : (target || null);
      if (!modal) {
        console.warn('UI.openModal: Target modal not found', target);
        return;
      }
      modal.classList.remove('hide');
      modal.classList.add('active');
      modal.style.display = 'flex';
      modal.style.pointerEvents = 'auto';
      modal.style.opacity = '1';
      modal.setAttribute('aria-hidden', 'false');
    },

    closeModal(target) {
      const modal = (typeof target === 'string') ? document.getElementById(target) : (target || null);
      if (!modal) return;
      modal.classList.add('hide');
      modal.classList.remove('active');
      modal.style.display = 'none';
      modal.style.pointerEvents = 'none';
      modal.setAttribute('aria-hidden', 'true');
    },

    // 1. Open & Render Game Modes Selection Modal
    openModesModal() {
      try {
        if (typeof SoundEngine !== 'undefined') SoundEngine.playClick();
      } catch (e) {}
      try {
        this.renderModes();
      } catch (e) {
        console.warn('renderModes error:', e);
      }
      this.openModal(els.modalModes || document.getElementById('modal-modes'));
    },

    // 2. Open & Render Themes Customization Modal
    openThemesModal() {
      try {
        if (typeof SoundEngine !== 'undefined') SoundEngine.playClick();
      } catch (e) {}
      try {
        this.renderThemes();
      } catch (e) {
        console.warn('renderThemes error:', e);
      }
      this.openModal(els.modalThemes || document.getElementById('modal-themes'));
    },

    // 3. Open & Render Settings Panel Modal
    openSettingsModal() {
      try {
        if (typeof SoundEngine !== 'undefined') SoundEngine.playClick();
      } catch (e) {}
      try {
        this.applySavedSettings();
      } catch (e) {
        console.warn('applySavedSettings error:', e);
      }
      this.openModal(els.modalSettings || document.getElementById('modal-settings'));
    },

    // 4. Open & Render Player Statistics Modal
    openStatsModal() {
      try {
        if (typeof SoundEngine !== 'undefined') SoundEngine.playClick();
      } catch (e) {}
      try {
        this.renderStats();
      } catch (e) {
        console.warn('renderStats error:', e);
      }
      this.openModal(els.modalStats || document.getElementById('modal-stats'));
    },

    // 5. Open High Scores Leaderboard Modal
    openLeaderboardModal() {
      try {
        if (typeof SoundEngine !== 'undefined') SoundEngine.playClick();
      } catch (e) {}
      try {
        this.renderLeaderboard();
      } catch (e) {
        console.warn('renderLeaderboard error:', e);
      }
      this.openModal(els.modalLeaderboard || document.getElementById('modal-leaderboard'));
    },

    // 6. Open Achievements Modal
    openAchievementsModal() {
      try {
        if (typeof SoundEngine !== 'undefined') SoundEngine.playClick();
      } catch (e) {}
      try {
        this.renderAchievements();
      } catch (e) {
        console.warn('renderAchievements error:', e);
      }
      this.openModal(els.modalAchievements || document.getElementById('modal-achievements'));
    },

    // 7. Open How To Play / Rules Modal
    openHowToModal() {
      try {
        if (typeof SoundEngine !== 'undefined') SoundEngine.playClick();
      } catch (e) {}
      this.openModal(els.modalHowTo || document.getElementById('modal-how-to'));
    },

    renderModes() {
      const modes = GameModes.getAll();
      const currentId = GameModes.getCurrentModeId();
      if (!els.modesGrid) els.modesGrid = document.getElementById('modes-grid');
      if (!els.modesGrid) return;
      els.modesGrid.innerHTML = '';

      modes.forEach(mode => {
        const isActive = (mode.id === currentId);
        const best = Storage.getModeBestScore(mode.id);

        const card = document.createElement('div');
        card.className = `mode-card ${isActive ? 'active' : ''}`;
        card.innerHTML = `
          <div class="mode-card-header">
            <span class="mode-icon">${mode.icon}</span>
            <span class="mode-badge-tag">${mode.badge}</span>
          </div>
          <h3 class="mode-card-title">${mode.name}</h3>
          <p class="mode-card-tagline">${mode.tagline}</p>
          <p class="mode-card-desc">${mode.description}</p>
          <div class="mode-card-footer">
            <span class="mode-record">RECORD: <strong>${best}</strong></span>
            <button type="button" class="btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'} btn-select-mode">
              ${isActive ? 'SELECTED' : 'SELECT'}
            </button>
          </div>
        `;

        card.addEventListener('click', () => {
          try { SoundEngine.playClick(); } catch (_) {}
          GameModes.setMode(mode.id);
          this.updateHomeModeBanner();
          this.renderModes();
        });

        els.modesGrid.appendChild(card);
      });
    },

    renderThemes() {
      const themes = Themes.getAll();
      const currentId = Themes.getCurrentId();
      if (!els.themesGrid) els.themesGrid = document.getElementById('themes-grid');
      if (!els.themesGrid) return;
      els.themesGrid.innerHTML = '';

      themes.forEach(theme => {
        const isCurrent = (theme.id === currentId);
        const card = document.createElement('div');
        card.className = `theme-card ${isCurrent ? 'active' : ''}`;

        card.innerHTML = `
          <div class="theme-card-top">
            <span class="theme-name"><span class="theme-dot" style="background:${theme.accentColor || '#BFA5FF'};"></span> ${theme.name}</span>
            ${isCurrent ? '<span class="theme-applied-badge">ACTIVE</span>' : ''}
          </div>
          <p class="theme-tagline">${theme.tagline}</p>
          <div class="theme-swatch-row">
            <span class="swatch-circle" style="background:${theme.cssVars['--neon-green']};" title="Snake Body"></span>
            <span class="swatch-circle" style="background:${theme.cssVars['--neon-cyan']};" title="Accent Scales"></span>
            <span class="swatch-circle" style="background:${theme.cssVars['--neon-food']};" title="Food Pellet"></span>
            <span class="swatch-circle" style="background:${theme.cssVars['--color-board-bg']}; border: 1px solid rgba(255,255,255,0.2);" title="Arena Background"></span>
          </div>
          <div class="theme-actions">
            <button type="button" class="btn btn-sm btn-secondary btn-preview-theme">PREVIEW</button>
            <button type="button" class="btn btn-sm ${isCurrent ? 'btn-primary disabled' : 'btn-primary'} btn-apply-theme">
              ${isCurrent ? 'APPLIED' : 'APPLY'}
            </button>
          </div>
        `;

        // Preview button
        const btnPreview = card.querySelector('.btn-preview-theme');
        btnPreview.addEventListener('click', (e) => {
          e.stopPropagation();
          try { SoundEngine.playClick(); } catch (_) {}
          Themes.preview(theme.id);
        });

        // Apply button
        const btnApply = card.querySelector('.btn-apply-theme');
        btnApply.addEventListener('click', (e) => {
          e.stopPropagation();
          try { SoundEngine.playClick(); } catch (_) {}
          Themes.apply(theme.id);
          this.renderThemes();
          this.showToast({ icon: '<svg viewBox="0 0 24 24" class="toast-svg"><path fill="#BFA5FF" d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.64 10.57 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>', title: 'Theme Applied', desc: `${theme.name} palette activated!` });
        });

        card.addEventListener('click', () => {
          try { SoundEngine.playClick(); } catch (_) {}
          Themes.apply(theme.id);
          this.renderThemes();
        });

        els.themesGrid.appendChild(card);
      });
    },

    renderStats() {
      const stats = Storage.getStats();

      // Format playtime seconds to HH:MM:SS or MM:SS
      const totalSec = stats.totalPlaytimeSec || 0;
      const hours = Math.floor(totalSec / 3600);
      const mins = Math.floor((totalSec % 3600) / 60);
      const secs = totalSec % 60;
      const formattedTime = hours > 0
        ? `${hours}h ${mins}m ${secs}s`
        : `${mins}m ${secs}s`;

      els.statsOverviewGrid.innerHTML = `
        <div class="stat-card">
          <span class="stat-card-label">GAMES PLAYED</span>
          <span class="stat-card-val neon-text-cyan">${stats.gamesPlayed || 0}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-label">TOTAL PELLETS EATEN</span>
          <span class="stat-card-val neon-text-green">${stats.foodCollected || 0}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-label">ALL-TIME HIGHEST SCORE</span>
          <span class="stat-card-val neon-text-yellow">${stats.highestOverallScore || 0}</span>
        </div>
        <div class="stat-card">
          <span class="stat-card-label">TOTAL PLAYTIME</span>
          <span class="stat-card-val">${formattedTime}</span>
        </div>
      `;

      // Mode Best Breakdown
      const modeScores = Storage.getModeScores();
      els.statsModeBestGrid.innerHTML = `
        <div class="mode-best-card">
          <span class="mode-name">
            <svg class="stat-mode-svg" viewBox="0 0 24 24"><path fill="#BFA5FF" d="M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.98l-2.83-2.83A5.334 5.334 0 0 0 5.4 6.62a5.38 5.38 0 0 0-5.4 5.38c0 2.97 2.43 5.38 5.4 5.38 1.44 0 2.8-.56 3.77-1.53L12 13.02l2.83 2.83c.97.97 2.33 1.53 3.77 1.53 2.97 0 5.4-2.41 5.4-5.38 0-2.97-2.43-5.38-5.4-5.38zm-13.2 8.76c-1.87 0-3.38-1.52-3.38-3.38 0-1.87 1.51-3.38 3.38-3.38 1 0 1.95.42 2.62 1.09L10.3 12l-2.28 2.29c-.67.67-1.62 1.09-2.62 1.09zm13.2 0c-1 0-1.95-.42-2.62-1.09L13.7 12l2.28-2.29c.67-.67 1.62-1.09 2.62-1.09 1.87 0 3.38 1.51 3.38 3.38 0 1.86-1.51 3.38-3.38 3.38z"/></svg>
            Infinity Mode
          </span>
          <span class="mode-score neon-text-green">${modeScores.infinity || 0}</span>
        </div>
        <div class="mode-best-card">
          <span class="mode-name">
            <svg class="stat-mode-svg" viewBox="0 0 24 24"><path fill="#FFC99F" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
            Classic Mode
          </span>
          <span class="mode-score neon-text-green">${modeScores.classic || 0}</span>
        </div>
        <div class="mode-best-card">
          <span class="mode-name">
            <svg class="stat-mode-svg" viewBox="0 0 24 24"><path fill="#FFE987" d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
            Time Attack
          </span>
          <span class="mode-score neon-text-green">${modeScores.timeAttack || 0}</span>
        </div>
        <div class="mode-best-card">
          <span class="mode-name">
            <svg class="stat-mode-svg" viewBox="0 0 24 24"><path fill="#A9E7EC" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            Obstacle Stages
          </span>
          <span class="mode-score neon-text-green">${stats.obstacleLevelsCompleted || 0} Cleared</span>
        </div>
      `;
    },

    // Render High Scores Leaderboard Table
    renderLeaderboard() {
      const list = Storage.getLeaderboard();
      els.leaderboardRows.innerHTML = '';

      if (list.length === 0) {
        els.leaderboardEmpty.classList.remove('hide');
        return;
      }

      els.leaderboardEmpty.classList.add('hide');
      list.forEach((entry, idx) => {
        const tr = document.createElement('tr');
        const rankBadge = idx === 0
          ? '<span class="rank-badge rank-gold">1</span>'
          : idx === 1
          ? '<span class="rank-badge rank-silver">2</span>'
          : idx === 2
          ? '<span class="rank-badge rank-bronze">3</span>'
          : `<span class="rank-badge rank-num">${idx + 1}</span>`;
        tr.innerHTML = `
          <td>${rankBadge}</td>
          <td class="neon-text-green"><strong>${entry.score}</strong></td>
          <td><span class="mode-badge-tag-sm">${entry.mode || 'CLASSIC'}</span></td>
          <td>Lv ${entry.level}</td>
          <td>${entry.difficulty}</td>
          <td>${entry.date}</td>
        `;
        els.leaderboardRows.appendChild(tr);
      });
    },

    // Render Achievements Modal
    renderAchievements() {
      const defs = Storage.getAchievementDefs();
      const unlocked = Storage.getUnlockedAchievements();

      els.achieveCount.textContent = `${unlocked.length} / ${defs.length}`;
      const pct = Math.round((unlocked.length / defs.length) * 100);
      els.achieveProgressFill.style.width = `${pct}%`;

      els.achievementsList.innerHTML = '';
      defs.forEach(ach => {
        const isUnlocked = unlocked.includes(ach.id);
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
          <div class="achieve-icon">${ach.icon}</div>
          <div class="achieve-info">
            <span class="achieve-title">${ach.title} ${isUnlocked ? '✓' : ''}</span>
            <span class="achieve-desc">${ach.desc}</span>
          </div>
        `;
        els.achievementsList.appendChild(card);
      });
    },

    // Show Achievement Toast
    showToast(achievement) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <span class="toast-icon">${achievement.icon}</span>
        <div class="toast-content">
          <span class="toast-title">NOTIFICATION</span>
          <span class="toast-desc"><strong>${achievement.title}</strong>: ${achievement.desc}</span>
        </div>
      `;

      els.toastContainer.appendChild(toast);
      SoundEngine.playAchievement();

      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    },

    // ==========================================
    // Coins & Evolution Displays
    // ==========================================
    updateCoinsDisplay() {
      if (typeof Storage === 'undefined') return;
      const coins = Storage.getCoins();
      const elsCoins = document.querySelectorAll('.coins-val-text');
      elsCoins.forEach(el => {
        el.textContent = coins.toLocaleString();
      });
    },

    updateEvolutionDisplay() {
      if (typeof SnakeEvolution === 'undefined') return;
      const prog = SnakeEvolution.getProgress();
      const elBadge = document.getElementById('player-evolution-badge');
      if (elBadge) {
        elBadge.textContent = prog.stage.name;
        elBadge.style.backgroundColor = prog.stage.badgeColor + '22';
        elBadge.style.color = prog.stage.badgeColor;
      }
    },

    // ==========================================
    // Adventure Worlds Modal
    // ==========================================
    openAdventureModal() {
      if (typeof AdventureWorld === 'undefined') return;
      const worlds = AdventureWorld.getWorlds();
      const progress = (typeof Storage !== 'undefined') ? Storage.getAdventureProgress() : { completedLevels: {}, unlockedWorlds: ['forest'] };
      const listEl = document.getElementById('adventure-worlds-list');
      if (!listEl) return;

      listEl.innerHTML = '';
      worlds.forEach(w => {
        const isUnlocked = AdventureWorld.isWorldUnlocked(w.id);
        const card = document.createElement('div');
        card.className = `adventure-world-card ${isUnlocked ? 'unlocked' : 'locked'}`;

        // 5 levels pills
        let levelsHtml = '<div class="adventure-levels-grid">';
        for (let lvl = 1; lvl <= 5; lvl++) {
          const key = `${w.id}_${lvl}`;
          const lvlData = progress.completedLevels ? progress.completedLevels[key] : null;
          const isLvlUnlocked = isUnlocked && (lvl === 1 || (progress.completedLevels && progress.completedLevels[`${w.id}_${lvl - 1}`]));
          const stars = lvlData ? lvlData.stars : 0;
          const starsHtml = '★'.repeat(stars) + '☆'.repeat(3 - stars);

          levelsHtml += `
            <button type="button" class="adventure-level-btn ${isLvlUnlocked ? 'active' : 'disabled'}"
              ${!isLvlUnlocked ? 'disabled' : ''}
              onclick="UI.startAdventureLevel('${w.id}', ${lvl})">
              <span class="lvl-num">Level ${lvl}</span>
              <span class="lvl-stars">${starsHtml}</span>
            </button>
          `;
        }
        levelsHtml += '</div>';

        card.innerHTML = `
          <div class="world-card-header" style="background:${w.bgColor}; border-left: 5px solid ${w.primaryColor}">
            <div class="world-card-top-row">
              <span class="world-badge-tag" style="background:${w.primaryColor}; color:#fff">${w.badge}</span>
              <h3 class="world-card-title">${w.name}</h3>
            </div>
            <p class="world-card-tagline">${w.tagline}</p>
          </div>
          <div class="world-card-body">
            ${isUnlocked ? levelsHtml : `<div class="world-locked-hint"><span>🔒 Unlock by earning stars in previous worlds!</span></div>`}
          </div>
        `;
        listEl.appendChild(card);
      });

      this.openModal('modal-adventure');
    },

    startAdventureLevel(worldId, levelNum) {
      this.closeModal('modal-adventure');
      SoundEngine.playClick();
      Game.startNewGame({ mode: 'adventure', worldId, levelNum });
    },

    // ==========================================
    // Snake Fashion Studio Modal
    // ==========================================
    openFashionModal() {
      if (typeof FashionStudio === 'undefined') return;
      this.fashionPreviewSkin = (typeof Storage !== 'undefined' ? Storage.getEquippedSkin() : 'skin_green') || 'skin_green';
      this.fashionPreviewHat = (typeof Storage !== 'undefined' ? Storage.getEquippedHat() : 'hat_none') || 'hat_none';
      this.renderFashionStudio('skins');
      this.openModal('modal-fashion');
      this.startFashionPreview();
    },

    setFashionPreviewItem(type, id) {
      if (type === 'skin') {
        this.fashionPreviewSkin = id;
      } else if (type === 'hat') {
        this.fashionPreviewHat = id;
      }
      try {
        if (typeof SoundEngine !== 'undefined') SoundEngine.playClick();
      } catch (_) {}
      const activeTab = document.querySelector('.fashion-tab-btn.active');
      const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'skins';
      this.renderFashionStudio(tabName);
    },

    startFashionPreview() {
      const canvas = document.getElementById('fashion-preview-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = 280 * dpr;
      canvas.height = 160 * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (this.fashionPreviewAnimId) {
        cancelAnimationFrame(this.fashionPreviewAnimId);
        this.fashionPreviewAnimId = null;
      }

      const renderPreview = () => {
        const modal = document.getElementById('modal-fashion');
        if (!modal || modal.classList.contains('hide') || modal.style.display === 'none') {
          this.fashionPreviewAnimId = null;
          return;
        }

        const time = performance.now();
        ctx.clearRect(0, 0, 280, 160);

        // Soft pastel preview pedestal
        const pedGrad = ctx.createRadialGradient(140, 138, 10, 140, 138, 90);
        pedGrad.addColorStop(0, '#EDE9FE');
        pedGrad.addColorStop(0.7, '#E0E7FF');
        pedGrad.addColorStop(1, 'rgba(224, 231, 255, 0)');
        ctx.fillStyle = pedGrad;
        ctx.beginPath();
        ctx.ellipse(140, 138, 85, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Drop shadow under mascot
        ctx.fillStyle = 'rgba(76, 29, 149, 0.12)';
        ctx.beginPath();
        ctx.ellipse(140, 137, 60, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        // Gentle floating bounce
        ctx.save();
        const floatY = Math.sin(time * 0.0035) * 4;
        ctx.translate(140, 85 + floatY);

        const cellSize = 38;
        const skinId = this.fashionPreviewSkin || (typeof Storage !== 'undefined' ? Storage.getEquippedSkin() : 'skin_green') || 'skin_green';
        const hatId = (this.fashionPreviewHat !== undefined) ? this.fashionPreviewHat : (typeof Storage !== 'undefined' ? Storage.getEquippedHat() : 'hat_none');
        const skinObj = FashionStudio.getSkin(skinId);
        const pal = (skinObj && skinObj.colors) ? skinObj.colors : FashionStudio.getActiveColors();

        // Sync preview badge title
        const titleEl = document.getElementById('fashion-preview-title');
        if (titleEl) {
          const hatObj = FashionStudio.getHats().find(h => h.id === hatId);
          const hatTxt = (hatId && hatId !== 'hat_none' && hatObj) ? ` • 🎩 ${hatObj.name}` : '';
          const nameTxt = `✨ ${skinObj ? skinObj.name : 'Classic'}${hatTxt}`;
          if (titleEl.textContent !== nameTxt) {
            titleEl.textContent = nameTxt;
          }
        }

        // Draw coiled snake body segments
        const bodySegments = [
          { x: -58, y: 32, r: 12 },
          { x: -44, y: 36, r: 15 },
          { x: -24, y: 34, r: 18 },
          { x: -4, y: 28, r: 20 },
          { x: 16, y: 18, r: 22 },
          { x: 0, y: 0, r: 24 }
        ];

        for (let i = 0; i < bodySegments.length - 1; i++) {
          const p1 = bodySegments[i];
          const p2 = bodySegments[i + 1];
          ctx.save();
          ctx.strokeStyle = pal.shade || '#26850E';
          ctx.lineWidth = p2.r * 1.8;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          ctx.strokeStyle = pal.body || '#4ECB23';
          ctx.lineWidth = p2.r * 1.45;
          ctx.stroke();

          ctx.strokeStyle = pal.belly || '#FFF58A';
          ctx.lineWidth = p2.r * 0.55;
          ctx.stroke();
          ctx.restore();
        }

        for (let i = 0; i < bodySegments.length - 1; i++) {
          const seg = bodySegments[i];
          ctx.save();
          ctx.translate(seg.x, seg.y);

          const grad = ctx.createRadialGradient(-seg.r * 0.25, -seg.r * 0.3, 1, 0, 0, seg.r);
          grad.addColorStop(0, pal.crest || '#85EA46');
          grad.addColorStop(0.5, pal.body || '#4ECB23');
          grad.addColorStop(1, pal.shade || '#26850E');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, seg.r, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = pal.belly || '#FFF58A';
          ctx.beginPath();
          ctx.ellipse(0, seg.r * 0.35, seg.r * 0.75, seg.r * 0.38, 0, 0, Math.PI);
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.beginPath();
          ctx.ellipse(-seg.r * 0.25, -seg.r * 0.35, seg.r * 0.4, seg.r * 0.2, -Math.PI / 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Draw preview cartoon head
        ctx.save();
        ctx.translate(14, -6);
        ctx.rotate(-0.08);

        const headLen = cellSize * 0.82;
        const headWidth = cellSize * 0.68;

        // Head shadow
        ctx.fillStyle = 'rgba(22, 101, 52, 0.15)';
        ctx.beginPath();
        ctx.ellipse(0, headWidth * 0.45, headLen * 0.7, headWidth * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head shape
        ctx.beginPath();
        ctx.moveTo(headLen * 0.62, 0);
        ctx.bezierCurveTo(headLen * 0.5, -headWidth * 0.45, headLen * 0.1, -headWidth * 0.62, -headLen * 0.4, -headWidth * 0.48);
        ctx.bezierCurveTo(-headLen * 0.55, -headWidth * 0.22, -headLen * 0.55, headWidth * 0.22, -headLen * 0.4, headWidth * 0.48);
        ctx.bezierCurveTo(headLen * 0.1, headWidth * 0.62, headLen * 0.5, headWidth * 0.45, headLen * 0.62, 0);
        ctx.closePath();

        const headGrad = ctx.createRadialGradient(headLen * 0.1, -headWidth * 0.15, cellSize * 0.1, 0, 0, headLen * 0.85);
        headGrad.addColorStop(0, pal.crest || '#85EA46');
        headGrad.addColorStop(0.45, pal.body || '#4ECB23');
        headGrad.addColorStop(1, pal.shade || '#26850E');
        ctx.fillStyle = headGrad;
        ctx.fill();

        // Belly
        ctx.fillStyle = pal.belly || '#FFF58A';
        ctx.beginPath();
        ctx.ellipse(0, headWidth * 0.32, headLen * 0.75, headWidth * 0.36, 0, 0, Math.PI);
        ctx.fill();

        // Rosy Cheeks
        ctx.fillStyle = pal.blush || '#FF7E98';
        [-1, 1].forEach(side => {
          ctx.beginPath();
          ctx.ellipse(headLen * 0.08, headWidth * 0.48 * side, cellSize * 0.16, cellSize * 0.11, 0, 0, Math.PI * 2);
          ctx.fill();
        });

        // Blinking & Smiling Eyes
        const isBlink = (Math.floor(time / 2600) % 6 === 0) && (time % 2600 < 180);
        const eyeX = headLen * 0.18;
        const eyeY = headWidth * 0.36;
        const eyeRadius = cellSize * 0.17;
        [-1, 1].forEach(side => {
          if (isBlink) {
            ctx.strokeStyle = pal.eyePupil || '#1E1B24';
            ctx.lineWidth = 2.4;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(eyeX, eyeY * side, eyeRadius * 0.7, 0.2, Math.PI - 0.2);
            ctx.stroke();
          } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(eyeX, eyeY * side, eyeRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = pal.eyePupil || '#1E1B24';
            ctx.beginPath();
            ctx.arc(eyeX + 0.6, eyeY * side, eyeRadius * 0.78, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(eyeX - eyeRadius * 0.22, eyeY * side - eyeRadius * 0.25 * side, eyeRadius * 0.35, 0, Math.PI * 2);
            ctx.arc(eyeX + eyeRadius * 0.28, eyeY * side + eyeRadius * 0.28 * side, eyeRadius * 0.16, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Smile
        ctx.strokeStyle = pal.shade || '#26850E';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(headLen * 0.36, 0, headWidth * 0.18, -Math.PI / 3.2, Math.PI / 3.2);
        ctx.stroke();

        const tongueTime = (time % 3200);
        if (tongueTime > 1200 && tongueTime < 1800) {
          const tProgress = Math.sin(((tongueTime - 1200) / 600) * Math.PI);
          ctx.strokeStyle = pal.tongue || '#FF6B8B';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(headLen * 0.52, 0);
          ctx.lineTo(headLen * 0.52 + 10 * tProgress, 0);
          ctx.stroke();
        }

        // Snout Top Gloss
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.ellipse(headLen * 0.15, -headWidth * 0.2, 8, 3.2, -Math.PI / 6, 0, Math.PI * 2);
        ctx.fill();

        // Wearable Hat & Evolution
        FashionStudio.drawHatOnHead(ctx, cellSize, hatId, time);
        if (typeof SnakeEvolution !== 'undefined') {
          SnakeEvolution.drawEvolutionFeatures(ctx, cellSize, time);
        }

        ctx.restore();
        ctx.restore();

        this.fashionPreviewAnimId = requestAnimationFrame(renderPreview);
      };

      this.fashionPreviewAnimId = requestAnimationFrame(renderPreview);
    },

    renderFashionStudio(tab = 'skins') {
      const container = document.getElementById('fashion-items-grid');
      if (!container) return;
      container.innerHTML = '';

      // Update tab buttons active state
      document.querySelectorAll('.fashion-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
      });

      if (tab === 'skins') {
        const skins = FashionStudio.getSkins();
        const equipped = Storage.getEquippedSkin();
        const currentPreview = this.fashionPreviewSkin || equipped;

        skins.forEach(s => {
          const isUnlocked = Storage.isFashionUnlocked(s.id);
          const isEquipped = equipped === s.id;
          const isPreviewing = currentPreview === s.id;
          const card = document.createElement('div');
          card.className = `fashion-item-card ${isEquipped ? 'equipped' : ''} ${isPreviewing ? 'preview-active' : ''}`;
          card.title = 'Tap to preview';
          card.innerHTML = `
            <div class="fashion-preview-color" style="background:${s.colors.body}; border:3px solid ${s.colors.crest}"></div>
            <div class="fashion-item-info">
              <span class="fashion-item-title">${s.name}</span>
              <span class="fashion-item-price">${isUnlocked ? 'Unlocked' : `🪙 ${s.cost}`}</span>
            </div>
            <button type="button" class="btn-fashion-action ${isEquipped ? 'btn-equipped' : isUnlocked ? 'btn-equip' : 'btn-buy'}">
              ${isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : `BUY 🪙${s.cost}`}
            </button>
          `;

          card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-fashion-action')) {
              e.stopPropagation();
              this.handleFashionClick('skin', s.id, s.cost);
            } else {
              this.setFashionPreviewItem('skin', s.id);
            }
          });

          container.appendChild(card);
        });
      } else if (tab === 'hats') {
        const hats = FashionStudio.getHats();
        const equipped = Storage.getEquippedHat();
        const currentPreview = this.fashionPreviewHat !== undefined ? this.fashionPreviewHat : equipped;

        hats.forEach(h => {
          const isUnlocked = Storage.isFashionUnlocked(h.id);
          const isEquipped = equipped === h.id;
          const isPreviewing = currentPreview === h.id;
          const card = document.createElement('div');
          card.className = `fashion-item-card ${isEquipped ? 'equipped' : ''} ${isPreviewing ? 'preview-active' : ''}`;
          card.title = 'Tap to preview';
          card.innerHTML = `
            <div class="fashion-preview-badge">${h.badge}</div>
            <div class="fashion-item-info">
              <span class="fashion-item-title">${h.name}</span>
              <span class="fashion-item-price">${isUnlocked ? 'Unlocked' : `🪙 ${h.cost}`}</span>
            </div>
            <button type="button" class="btn-fashion-action ${isEquipped ? 'btn-equipped' : isUnlocked ? 'btn-equip' : 'btn-buy'}">
              ${isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : `BUY 🪙${h.cost}`}
            </button>
          `;

          card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-fashion-action')) {
              e.stopPropagation();
              this.handleFashionClick('hat', h.id, h.cost);
            } else {
              this.setFashionPreviewItem('hat', h.id);
            }
          });

          container.appendChild(card);
        });
      } else if (tab === 'patterns') {
        const patterns = FashionStudio.getPatterns();
        const equipped = Storage.getEquippedPattern();
        patterns.forEach(p => {
          const isUnlocked = Storage.isFashionUnlocked(p.id);
          const isEquipped = equipped === p.id;
          const card = document.createElement('div');
          card.className = `fashion-item-card ${isEquipped ? 'equipped' : ''}`;
          card.innerHTML = `
            <div class="fashion-preview-badge">PATTERN</div>
            <div class="fashion-item-info">
              <span class="fashion-item-title">${p.name}</span>
              <span class="fashion-item-price">${isUnlocked ? 'Unlocked' : `🪙 ${p.cost}`}</span>
            </div>
            <button type="button" class="btn-fashion-action ${isEquipped ? 'btn-equipped' : isUnlocked ? 'btn-equip' : 'btn-buy'}"
              onclick="UI.handleFashionClick('pattern', '${p.id}', ${p.cost})">
              ${isEquipped ? 'EQUIPPED' : isUnlocked ? 'EQUIP' : `BUY 🪙${p.cost}`}
            </button>
          `;
          container.appendChild(card);
        });
      }
    },

    handleFashionClick(type, id, cost) {
      if (Storage.isFashionUnlocked(id)) {
        if (type === 'skin') {
          Storage.setEquippedSkin(id);
          this.fashionPreviewSkin = id;
        } else if (type === 'hat') {
          Storage.setEquippedHat(id);
          this.fashionPreviewHat = id;
        } else if (type === 'pattern') {
          Storage.setEquippedPattern(id);
        }
        SoundEngine.playClick();
      } else {
        const success = FashionStudio.unlockItem(id, cost);
        if (success) {
          if (type === 'skin') {
            Storage.setEquippedSkin(id);
            this.fashionPreviewSkin = id;
          } else if (type === 'hat') {
            Storage.setEquippedHat(id);
            this.fashionPreviewHat = id;
          } else if (type === 'pattern') {
            Storage.setEquippedPattern(id);
          }
          this.updateCoinsDisplay();
          this.showToast({
            title: 'Fashion Unlocked!',
            desc: 'New style ready to wear on the adventure!',
            icon: '🎨'
          });
        } else {
          this.showToast({
            title: 'Need More Coins!',
            desc: `You need 🪙 ${cost} coins. Play adventure levels to earn more!`,
            icon: '🪙'
          });
          return;
        }
      }
      const activeTab = document.querySelector('.fashion-tab-btn.active');
      const tabName = activeTab ? activeTab.getAttribute('data-tab') : 'skins';
      this.renderFashionStudio(tabName);
    },

    // ==========================================
    // Daily Rewards, 7-Day Streak & Missions
    // ==========================================
    updateStreakDisplay() {
      if (typeof DailySystem === 'undefined') return;
      const info = DailySystem.getStreakInfo();
      const rewards = DailySystem.getStreakRewards();

      const headerPill = document.getElementById('btn-header-streak');
      const headerVal = document.getElementById('header-streak-val');
      if (headerVal) {
        headerVal.textContent = `${info.streak}/7`;
      }
      if (headerPill) {
        headerPill.classList.toggle('streak-ready-pulse', !info.isClaimedToday);
      }

      const homeCount = document.getElementById('home-streak-count');
      if (homeCount) {
        homeCount.textContent = `${info.streak}/7`;
      }

      const homeDots = document.getElementById('home-streak-dots');
      if (homeDots) {
        homeDots.innerHTML = rewards.map(r => {
          const isDone = r.day < info.streak || (r.day === info.streak && info.isClaimedToday);
          const isToday = r.day === info.streak && !info.isClaimedToday;
          const isDay7 = r.day === 7;
          const cls = isDone ? 'done' : isToday ? 'today' : 'future';
          const label = isDay7 ? '👑' : (isDone ? '✓' : `D${r.day}`);
          return `<div class="home-streak-dot ${cls} ${isDay7 ? 'day-7' : ''}" title="Day ${r.day}: ${r.coins} Coins">${label}</div>`;
        }).join('');
      }

      const btnHomeAction = document.getElementById('btn-home-streak-action');
      if (btnHomeAction) {
        if (info.isClaimedToday) {
          btnHomeAction.textContent = 'CLAIMED ✓';
          btnHomeAction.classList.add('is-claimed');
        } else {
          const todayCoins = rewards[info.streak - 1] ? rewards[info.streak - 1].coins : 50;
          btnHomeAction.textContent = info.streak === 7 ? 'CLAIM 👑' : `CLAIM 🪙${todayCoins}`;
          btnHomeAction.classList.remove('is-claimed');
        }
      }
    },

    handleHomeStreakAction() {
      if (typeof DailySystem === 'undefined') return;
      const info = DailySystem.getStreakInfo();
      if (!info.isClaimedToday) {
        this.claimTodayStreak(false);
      } else {
        this.openDailyModal();
      }
    },

    openDailyModal() {
      if (typeof DailySystem === 'undefined') return;
      const rewards = DailySystem.getStreakRewards();
      const info = DailySystem.getStreakInfo();

      const summaryEl = document.getElementById('streak-stats-summary');
      if (summaryEl) {
        summaryEl.innerHTML = `
          <span class="streak-stat-chip">🔥 ${info.streak}/7 Cycle</span>
          <span class="streak-stat-chip">🏆 Best: ${info.longestStreak || info.streak}d</span>
          <span class="streak-stat-chip">👑 7-Day Wins: ${info.completed7DayCount || 0}</span>
        `;
      }

      const streakGrid = document.getElementById('daily-streak-grid');
      if (streakGrid) {
        streakGrid.innerHTML = '';
        rewards.forEach(r => {
          const isToday = r.day === info.streak;
          const isPassed = r.day < info.streak;
          const isDay7 = r.day === 7;
          const card = document.createElement('div');
          card.className = `streak-day-card ${isToday ? 'today' : isPassed ? 'done' : 'future'} ${isDay7 ? 'day-7' : ''}`;
          card.innerHTML = `
            <span class="streak-day-label">${isDay7 ? 'DAY 7 👑' : `Day ${r.day}`}</span>
            <span class="streak-day-coin">🪙 ${r.coins}${isDay7 ? ' + Hat' : ''}</span>
            ${isPassed ? '<span class="streak-check">✓</span>' : isToday && info.isClaimedToday ? '<span class="streak-claimed">CLAIMED</span>' : isToday ? '<span class="streak-ready">READY</span>' : '<span class="streak-locked">🔒</span>'}
          `;
          streakGrid.appendChild(card);
        });

        const btnClaim = document.getElementById('btn-claim-daily-streak');
        if (btnClaim) {
          if (info.isClaimedToday) {
            btnClaim.disabled = true;
            btnClaim.textContent = info.streak === 7
              ? '7-DAY JACKPOT CLAIMED ✓'
              : `CLAIMED TODAY ✓ (NEXT: DAY ${info.streak + 1})`;
          } else {
            btnClaim.disabled = false;
            btnClaim.textContent = info.streak === 7
              ? 'CLAIM 7-DAY JACKPOT! (🪙 500 + 👑 CROWN + 250 XP)'
              : `CLAIM DAY ${info.streak} (🪙 ${rewards[info.streak - 1].coins})`;
          }
        }
      }

      // Render Daily Missions
      const missions = DailySystem.getMissions();
      const missionsList = document.getElementById('daily-missions-list');
      if (missionsList) {
        missionsList.innerHTML = '';
        missions.forEach(m => {
          const isDone = m.current >= m.target;
          const item = document.createElement('div');
          item.className = `daily-mission-item ${m.claimed ? 'claimed' : isDone ? 'ready' : ''}`;
          item.innerHTML = `
            <div class="mission-text-col">
              <span class="mission-title">${m.title}</span>
              <span class="mission-desc">${m.desc} (${m.current}/${m.target})</span>
              <div class="mission-progress-bar">
                <div class="mission-progress-fill" style="width:${Math.min(100, (m.current / m.target) * 100)}%"></div>
              </div>
            </div>
            <button type="button" class="btn-claim-mission ${m.claimed ? 'claimed' : isDone ? 'ready' : 'disabled'}"
              ${m.claimed || !isDone ? 'disabled' : ''}
              onclick="UI.claimDailyMission('${m.id}')">
              ${m.claimed ? 'CLAIMED' : `CLAIM 🪙${m.reward}`}
            </button>
          `;
          missionsList.appendChild(item);
        });
      }

      this.openModal('modal-daily');
    },

    claimTodayStreak(reopenModal = true) {
      const result = DailySystem.claimTodayStreak();
      if (result && result.coins > 0) {
        this.updateCoinsDisplay();
        this.updateEvolutionDisplay();
        this.updateStreakDisplay();
        if (reopenModal) {
          this.openDailyModal();
        }
        if (result.isDay7Grand) {
          const crownNote = result.crownUnlocked
            ? 'Royal Crown Hat unlocked & equipped!'
            : 'Bonus +200 Coins (Crown already owned)!';
          this.showToast({
            title: '7-DAY STREAK JACKPOT! 👑',
            desc: `+${result.coins} Coins, +${result.expEarned} XP & ${crownNote}`,
            icon: '🔥'
          });
        } else {
          this.showToast({
            title: `Day ${result.day} Streak Claimed!`,
            desc: `+${result.coins} Coins added! Keep going for Day 7!`,
            icon: '🔥'
          });
        }
      }
    },

    claimDailyMission(id) {
      const rewarded = DailySystem.claimMission(id);
      if (rewarded > 0) {
        this.updateCoinsDisplay();
        this.openDailyModal();
        this.showToast({
          title: 'Mission Reward Claimed!',
          desc: `+${rewarded} Coins earned!`,
          icon: '🎉'
        });
      }
    },

    // ==========================================
    // Adventure Level Victory & Evolution Modals
    // ==========================================
    showLevelVictory(data) {
      const modal = document.getElementById('modal-level-victory');
      if (!modal) return;

      const titleEl = document.getElementById('victory-world-title');
      const missionEl = document.getElementById('victory-mission-name');
      const scoreEl = document.getElementById('victory-score-val');
      const coinsEl = document.getElementById('victory-coins-val');

      if (titleEl) titleEl.textContent = `${data.worldName} - Level ${data.levelNum}`;
      if (missionEl) missionEl.textContent = data.title;
      if (scoreEl) scoreEl.textContent = data.score;
      if (coinsEl) coinsEl.textContent = `+${data.coinsReward} Coins`;

      const starsContainer = document.getElementById('victory-stars-row');
      if (starsContainer) {
        starsContainer.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
          const star = document.createElement('span');
          star.className = `victory-star ${i <= data.stars ? 'earned' : 'empty'}`;
          star.textContent = '★';
          starsContainer.appendChild(star);
        }
      }

      this.updateCoinsDisplay();
      this.openModal('modal-level-victory');
    },

    showEvolutionCelebration(stage) {
      const modal = document.getElementById('modal-evolution');
      if (!modal) return;
      const tEl = document.getElementById('evolution-stage-title');
      const dEl = document.getElementById('evolution-stage-desc');
      const pEl = document.getElementById('evolution-stage-perk');
      if (tEl) tEl.textContent = stage.name;
      if (dEl) dEl.textContent = stage.desc;
      if (pEl) pEl.textContent = stage.perk;
      this.updateEvolutionDisplay();
      this.openModal('modal-evolution');
    },

    // ==========================================
    // In-Game Gameplay HUD Elements (memoized to prevent 60fps DOM thrashing)
    // ==========================================
    updatePowerUpBar(activeEffects) {
      const container = document.getElementById('hud-powerups-container');
      if (!container) return;
      const keys = activeEffects ? Object.keys(activeEffects) : [];
      if (keys.length === 0) {
        if (lastPowerUpVisible !== false) {
          lastPowerUpVisible = false;
          lastPowerUpHtml = '';
          container.innerHTML = '';
          container.classList.add('hide');
        }
        return;
      }
      if (lastPowerUpVisible !== true) {
        lastPowerUpVisible = true;
        container.classList.remove('hide');
      }
      let html = '';
      keys.forEach(k => {
        const item = activeEffects[k];
        const pct = Math.round((item.remaining / item.duration) * 100);
        html += `
          <div class="hud-powerup-badge powerup-${k}">
            <span class="powerup-name">${k.toUpperCase()}</span>
            <div class="powerup-timer-ring" style="width:${pct}%"></div>
          </div>
        `;
      });
      if (html !== lastPowerUpHtml) {
        lastPowerUpHtml = html;
        container.innerHTML = html;
      }
    },

    updateGhostDelta(delta) {
      const el = document.getElementById('hud-ghost-delta');
      if (!el) return;
      if (delta === null || typeof delta === 'undefined') {
        if (lastGhostVisible !== false) {
          lastGhostVisible = false;
          lastGhostText = '';
          el.classList.add('hide');
        }
        return;
      }
      const nextClass = delta >= 0 ? 'hud-ghost-pill ghost-ahead' : 'hud-ghost-pill ghost-behind';
      const nextText = delta >= 0 ? `+${delta} Ahead 👻` : `${delta} Behind 👻`;
      if (lastGhostVisible !== true || nextText !== lastGhostText) {
        lastGhostVisible = true;
        lastGhostText = nextText;
        el.className = nextClass;
        el.textContent = nextText;
      }
    },

    updateAdventureMissionHUD(text, percent) {
      const elBanner = document.getElementById('hud-adventure-mission');
      if (!elBanner) return;
      if (!text) {
        if (lastMissionVisible !== false) {
          lastMissionVisible = false;
          lastMissionText = '';
          lastMissionPct = -1;
          elBanner.classList.add('hide');
        }
        return;
      }
      if (lastMissionVisible !== true) {
        lastMissionVisible = true;
        elBanner.classList.remove('hide');
      }
      if (text !== lastMissionText) {
        lastMissionText = text;
        const elText = document.getElementById('hud-mission-text');
        if (elText) elText.textContent = text;
      }
      const roundedPct = Math.round(percent);
      if (roundedPct !== lastMissionPct) {
        lastMissionPct = roundedPct;
        const elBar = document.getElementById('hud-mission-bar');
        if (elBar) elBar.style.width = `${roundedPct}%`;
      }
    },

    showPowerUpToast(def) {
      this.showToast({
        title: `Power-Up: ${def.name}!`,
        desc: def.desc,
        icon: '<svg viewBox="0 0 24 24"><path fill="#F59E0B" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>'
      });
    }
  };

  // Expose UI globally for reliable inline DOM triggering
  if (typeof window !== 'undefined') {
    window.UI = UI;
  }

  return UI;
})();
