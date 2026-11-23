/**
 * NEON SNAKE - UI Controller & DOM Manager
 * Handles multi-mode selection, theme customizer, full settings panel,
 * player statistics dashboard, HUD, overlays, modals, and mobile touch bindings.
 */

const UI = (() => {
  const els = {};

  let heroAnimationId = null;

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
    els.btnHomeFullscreen = document.getElementById('btn-home-fullscreen');
    els.heroCanvas = document.getElementById('hero-canvas');

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

  // Setup animated hero banner on home screen
  const initHeroCanvas = () => {
    if (!els.heroCanvas) return;
    const canvas = els.heroCanvas;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const renderHero = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pal = (typeof Themes !== 'undefined') ? Themes.getPalette() : {
        crest: '#E4D6FF',
        body: '#BFA5FF',
        shade: '#9875E6',
        belly: '#F4EEFF',
        blush: '#FF85A1',
        eyePupil: '#1E1B24',
        tongue: '#FF777D'
      };

      // Friendly subtle pastel grid in hero
      ctx.strokeStyle = pal.gridLine || 'rgba(191, 165, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Sine-wave slithering snake
      const segments = 16;
      const spacing = 11;
      const centerY = canvas.height / 2;
      const snakeLength = segments * spacing; // 176px
      const loopWidth = canvas.width + snakeLength + 100; // Continuous travel span before looping
      const headOffset = ((t * 55) % loopWidth + loopWidth) % loopWidth;
      const headX = headOffset - 50; // Starts fully offscreen left (-50px)

      const pts = [];
      for (let i = 0; i <= segments; i++) {
        // Continuous positions strictly behind the head - no separate per-segment modulo
        const segX = headX - (i * spacing);
        const segY = centerY + Math.sin((segX * 0.038) + t * 3.5) * 16;
        pts.push({ x: segX, y: segY });
      }

      // Draw continuous cute body bridge
      for (let i = segments; i > 0; i--) {
        const p1 = pts[i];
        const p2 = pts[i - 1];

        // Guard against any possible discontinuity
        if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > spacing * 2.2) {
          continue;
        }

        const width = 13 * (1 - (i / (segments + 4)) * 0.45);

        ctx.save();
        ctx.strokeStyle = pal.shade || '#9875E6';
        ctx.lineWidth = width + 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.strokeStyle = pal.body || '#BFA5FF';
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.restore();
      }

      // Draw plump rounded segments & cute face
      for (let i = segments; i >= 0; i--) {
        const pt = pts[i];
        const isHead = (i === 0);
        const taper = 1 - (i / segments) * 0.55;
        const radius = isHead ? 8.5 : Math.max(3, 6.5 * taper);

        ctx.save();
        ctx.translate(pt.x, pt.y);

        if (isHead) {
          const prev = pts[1] || pt;
          const angle = Math.atan2(pt.y - prev.y, pt.x - prev.x);
          ctx.rotate(angle);

          // Animated flicking pink tongue
          const tongueFlick = Math.sin(t * 12);
          if (tongueFlick > 0.4) {
            ctx.save();
            ctx.strokeStyle = pal.tongue || '#FF777D';
            ctx.lineWidth = 1.8;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(radius + 1, 0);
            ctx.lineTo(radius + 9, Math.sin(t * 30) * 1.5);
            ctx.lineTo(radius + 13, -2.5);
            ctx.moveTo(radius + 9, Math.sin(t * 30) * 1.5);
            ctx.lineTo(radius + 13, 2.5);
            ctx.stroke();
            ctx.restore();
          }

          // Cute rounded head
          ctx.shadowColor = 'rgba(48, 45, 53, 0.14)';
          ctx.shadowBlur = 8;
          ctx.fillStyle = pal.body || '#BFA5FF';
          ctx.beginPath();
          ctx.ellipse(0, 0, radius * 1.25, radius, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.strokeStyle = pal.shade || '#825ECC';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Rosy Pink Blush
          ctx.fillStyle = pal.blush || '#FF85A1';
          [-1, 1].forEach(side => {
            ctx.beginPath();
            ctx.arc(radius * 0.1, radius * 0.58 * side, 2.4, 0, Math.PI * 2);
            ctx.fill();
          });

          // Large Expressive Cartoon Eyes with Double Shine
          [-1, 1].forEach(side => {
            const ey = radius * 0.38 * side;
            // Eye socket
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(radius * 0.28, ey, 3.2, 0, Math.PI * 2);
            ctx.fill();

            // Pupil
            ctx.fillStyle = pal.eyePupil || '#1E1B24';
            ctx.beginPath();
            ctx.arc(radius * 0.32, ey, 2.3, 0, Math.PI * 2);
            ctx.fill();

            // Catchlights
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(radius * 0.24, ey - 0.7 * side, 1.0, 0, Math.PI * 2);
            ctx.arc(radius * 0.38, ey + 0.7 * side, 0.5, 0, Math.PI * 2);
            ctx.fill();
          });
        } else {
          // Plump Body Segment with 3D Radial Pastel Highlight
          const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.3, 1, 0, 0, radius);
          grad.addColorStop(0, pal.crest || '#E4D6FF');
          grad.addColorStop(0.5, pal.body || '#BFA5FF');
          grad.addColorStop(1, pal.shade || '#9875E6');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(0, 0, radius * 1.1, radius, 0, 0, Math.PI * 2);
          ctx.fill();

          // Specular shine dot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.beginPath();
          ctx.arc(-radius * 0.25, -radius * 0.35, radius * 0.26, 0, Math.PI * 2);
          ctx.fill();

          // Pointed tail tip
          if (i === segments) {
            const prev = pts[segments - 1] || pt;
            const tailAngle = Math.atan2(pt.y - prev.y, pt.x - prev.x);
            ctx.save();
            ctx.rotate(tailAngle);
            ctx.fillStyle = pal.body || '#BFA5FF';
            ctx.beginPath();
            ctx.moveTo(0, -radius * 0.45);
            ctx.lineTo(-radius * 1.4, 0);
            ctx.lineTo(0, radius * 0.45);
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

  return {
    init() {
      cacheElements();
      this.updatePlayerProfile();
      this.applySavedSettings();
      this.updateHomeModeBanner();
      this.updateBestScoreDisplay();
      this.updateSoundToggles();
      initHeroCanvas();
      this.bindEvents();
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

      // Sound toggles
      const toggleAudio = () => {
        const settings = Storage.getSettings();
        const nextState = !settings.soundEnabled;
        Storage.saveSettings({ soundEnabled: nextState });
        SoundEngine.setSoundEnabled(nextState);
        this.updateSoundToggles();
        if (nextState) SoundEngine.playClick();
      };

      if (els.btnToggleSound) els.btnToggleSound.addEventListener('click', toggleAudio);
      if (els.btnHudSound) els.btnHudSound.addEventListener('click', toggleAudio);

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

      // Delegated document listeners for click & touchend (triple redundancy)
      const handleGlobalModalTrigger = (e) => {
        const btn = e.target.closest('button, [role="button"], [data-close]');
        if (!btn) return;

        const id = btn.id;
        const closeId = btn.getAttribute('data-close');

        if (closeId) {
          try { SoundEngine.playClick(); } catch (_) {}
          this.closeModal(closeId);
          e.preventDefault();
          return;
        }

        if (id === 'btn-open-modes' || id === 'btn-banner-modes' || id === 'btn-gameover-modes') {
          this.openModesModal();
          e.preventDefault();
        } else if (id === 'btn-open-themes') {
          this.openThemesModal();
          e.preventDefault();
        } else if (id === 'btn-open-settings') {
          this.openSettingsModal();
          e.preventDefault();
        } else if (id === 'btn-open-stats') {
          this.openStatsModal();
          e.preventDefault();
        } else if (id === 'btn-open-leaderboard') {
          this.openLeaderboardModal();
          e.preventDefault();
        } else if (id === 'btn-open-achievements') {
          this.openAchievementsModal();
          e.preventDefault();
        } else if (id === 'btn-open-how-to') {
          this.openHowToModal();
          e.preventDefault();
        }
      };

      document.addEventListener('click', handleGlobalModalTrigger);
      document.addEventListener('touchend', (e) => {
        const btn = e.target.closest('.home-nav .btn, .btn-switch-mode, .btn-modal-close, [data-close]');
        if (btn) {
          handleGlobalModalTrigger(e);
        }
      }, { passive: false });

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
        });
      }

      if (els.settingBgmEnabled) {
        els.settingBgmEnabled.addEventListener('change', (e) => {
          const enabled = e.target.checked;
          Storage.saveSettings({ bgmEnabled: enabled });
          SoundEngine.setBgmEnabled(enabled);
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
          Themes.apply('neon-green');
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
      } else {
        els.screenGame.classList.remove('active');
        els.screenHome.classList.add('active');
        document.body.classList.remove('in-game');
        window.scrollTo(0, 0);
        this.updatePlayerProfile();
        this.updateHomeModeBanner();
        this.updateBestScoreDisplay();
      }
    },

    // Sound toggle icon sync
    updateSoundToggles() {
      const isMuted = SoundEngine.isMuted();
      document.querySelectorAll('.icon-sound-on').forEach(icon => {
        icon.classList.toggle('hide', isMuted);
      });
      document.querySelectorAll('.icon-sound-off').forEach(icon => {
        icon.classList.toggle('hide', !isMuted);
      });
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

    // Time Attack Timer Display
    updateTimer(secondsRemaining) {
      if (!els.hudTimerVal) return;
      const totalSecs = Math.max(0, Math.ceil(secondsRemaining));
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      els.hudTimerVal.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
      if (totalSecs <= 10) {
        els.hudTimerVal.classList.add('timer-urgent');
      } else {
        els.hudTimerVal.classList.remove('timer-urgent');
      }
    },

    // Obstacle Mode Progress Display
    updateObstacleProgress(current, target) {
      if (els.hudObstacleVal) {
        els.hudObstacleVal.textContent = `${current}/${target}`;
      }
    },

    // Bonus Star Timer Bar
    updateBonusBar(remaining, maxTime) {
      if (remaining > 0) {
        els.bonusBanner.classList.remove('hide');
        const pct = Math.max(0, Math.min(100, (remaining / maxTime) * 100));
        els.bonusTimerFill.style.width = `${pct}%`;
      } else {
        els.bonusBanner.classList.add('hide');
      }
    },

    // Countdown Overlay (3, 2, 1, GO!)
    showCountdown(count, onComplete) {
      els.countdownOverlay.classList.remove('hide');
      let current = count;

      const tick = () => {
        if (current > 0) {
          els.countdownText.textContent = current;
          els.countdownText.style.animation = 'none';
          void els.countdownText.offsetWidth; // Reflow
          els.countdownText.style.animation = 'countdownPop 0.85s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards';
          SoundEngine.playCountdown(false);
          current--;
          setTimeout(tick, 900);
        } else if (current === 0) {
          els.countdownText.textContent = 'GO!';
          els.countdownText.style.animation = 'none';
          void els.countdownText.offsetWidth;
          els.countdownText.style.animation = 'countdownPop 0.85s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards';
          SoundEngine.playCountdown(true);
          current--;
          setTimeout(tick, 750);
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
      modal.style.display = 'flex';
      modal.style.pointerEvents = 'auto';
      modal.style.opacity = '1';
      modal.setAttribute('aria-hidden', 'false');
    },

    closeModal(target) {
      const modal = (typeof target === 'string') ? document.getElementById(target) : (target || null);
      if (!modal) return;
      modal.classList.add('hide');
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
    }
  };

  // Expose UI globally for reliable inline DOM triggering
  if (typeof window !== 'undefined') {
    window.UI = UI;
  }

  return UI;
})();
