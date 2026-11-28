/**
 * NEON SNAKE - Procedural Web Audio Engine
 * Pure synthesized sound effects and synthwave background arpeggiator.
 * 100% royalty-free, zero external assets, works seamlessly offline.
 * Supports volume control, SFX & BGM switches, and mode-specific audio.
 */

const SoundEngine = (() => {
  let ctx = null;
  let masterGain = null;
  let bgmGain = null;
  let sfxGain = null;
  let noiseBuffer = null;

  let isSoundEnabled = true;
  let isSfxEnabled = true;
  let isBgmEnabled = true;
  let masterVolume = 0.8;

  let isBgmPlaying = false;
  let bgmInterval = null;
  let bgmStep = 0;
  let lastTurnSoundAt = 0;

  const BGM_BASE_LEVEL = 0.42;

  const ensureNoiseBuffer = () => {
    if (!ctx || noiseBuffer) return;
    const len = Math.floor(ctx.sampleRate * 0.8);
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  };

  // Initialize or resume Audio Context on user interaction
  const initContext = () => {
    try {
      if (!ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        ctx = new AudioCtx();

        masterGain = ctx.createGain();
        masterGain.gain.value = isSoundEnabled ? masterVolume : 0;
        masterGain.connect(ctx.destination);

        sfxGain = ctx.createGain();
        sfxGain.gain.value = isSfxEnabled ? 0.95 : 0;
        sfxGain.connect(masterGain);

        bgmGain = ctx.createGain();
        bgmGain.gain.value = isBgmEnabled ? BGM_BASE_LEVEL : 0;
        bgmGain.connect(masterGain);

        ensureNoiseBuffer();
      }

      if (ctx && ctx.state === 'suspended' && !document.hidden) {
        ctx.resume().catch(() => {});
      }
    } catch (e) {}
  };

  // Synthesize realistic snake hiss ("sssss") using filtered noise + tongue flutter LFO
  const triggerSnakeHiss = (duration = 0.24, volume = 0.28, startDelay = 0) => {
    if (!ctx || !sfxGain) return;
    ensureNoiseBuffer();
    if (!noiseBuffer) return;

    const now = ctx.currentTime + startDelay;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    src.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(3600, now);
    bandpass.frequency.exponentialRampToValueAtTime(5600, now + duration * 0.45);
    bandpass.frequency.exponentialRampToValueAtTime(3200, now + duration);
    bandpass.Q.value = 2.4;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1800;

    const hissGain = ctx.createGain();
    hissGain.gain.setValueAtTime(0.001, now);
    hissGain.gain.linearRampToValueAtTime(volume, now + Math.min(0.03, duration * 0.2));
    hissGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Tongue flutter modulation (~24 Hz)
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 24;
    lfoGain.gain.value = volume * 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(hissGain.gain);

    src.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(hissGain);
    hissGain.connect(sfxGain);

    src.onended = () => {
      try {
        lfo.stop();
        lfo.disconnect();
        lfoGain.disconnect();
        src.disconnect();
        bandpass.disconnect();
        highpass.disconnect();
        hissGain.disconnect();
      } catch (_) {}
    };

    lfo.start(now);
    src.start(now);
    src.stop(now + duration);
  };

  return {
    init() {
      const settings = (typeof Storage !== 'undefined') ? Storage.getSettings() : {};
      isSoundEnabled = settings.soundEnabled ?? true;
      isSfxEnabled = settings.sfxEnabled ?? true;
      isBgmEnabled = settings.bgmEnabled ?? true;
      masterVolume = (typeof settings.volume === 'number') ? settings.volume : 0.8;

      // Unlock / resume Web Audio context on user gestures
      const unlockAudio = () => {
        initContext();
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });

      document.addEventListener('visibilitychange', () => {
        if (!ctx) return;
        if (document.hidden) {
          this.stopBGM();
          if (ctx.state === 'running') {
            ctx.suspend().catch(() => {});
          }
        } else if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      });
    },

    setSoundEnabled(enabled) {
      isSoundEnabled = !!enabled;
      if (masterGain && ctx) {
        masterGain.gain.setValueAtTime(isSoundEnabled ? masterVolume : 0, ctx.currentTime);
      }
      if (!isSoundEnabled) {
        this.stopBGM();
      }
    },

    setSfxEnabled(enabled) {
      isSfxEnabled = !!enabled;
      if (sfxGain && ctx) {
        sfxGain.gain.setValueAtTime(isSfxEnabled ? 0.95 : 0, ctx.currentTime);
      }
    },

    setBgmEnabled(enabled) {
      isBgmEnabled = !!enabled;
      if (bgmGain && ctx) {
        bgmGain.gain.setValueAtTime(isBgmEnabled ? BGM_BASE_LEVEL : 0, ctx.currentTime);
      }
      if (!isBgmEnabled) {
        this.stopBGM();
      }
    },

    setVolume(vol) {
      masterVolume = Math.max(0, Math.min(1, vol));
      if (masterGain && ctx && isSoundEnabled) {
        masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);
      }
    },

    isMuted() {
      return !isSoundEnabled;
    },

    isSfxMuted() {
      return !isSoundEnabled || !isSfxEnabled;
    },

    isBgmMuted() {
      return !isSoundEnabled || !isBgmEnabled;
    },

    vibrate(pattern = 25) {
      const settings = (typeof Storage !== 'undefined') ? Storage.getSettings() : {};
      if (settings.vibration !== false && navigator && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate(pattern);
        } catch (e) {}
      }
    },

    // Realistic Snake Hiss Voice
    playSnakeHiss(duration = 0.25, volume = 0.28) {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;
      try {
        triggerSnakeHiss(duration, volume);
      } catch (_) {}
    },

    // Subtle throttled snake slither whisper on direction turns
    playSlitherTurn() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      const nowMs = performance.now();
      if (nowMs - lastTurnSoundAt < 180) return;
      lastTurnSoundAt = nowMs;
      initContext();
      if (!ctx || ctx.state !== 'running') return;
      try {
        triggerSnakeHiss(0.075, 0.08);
      } catch (_) {}
    },

    // 1. Eat Food Sound (Snake bite/hiss + juicy gulp + bright pop + crisp eat vibration)
    playEat() {
      this.vibrate(38);
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      try {
        const now = ctx.currentTime;

        // Crisp snake snap hiss
        triggerSnakeHiss(0.14, 0.24);

        // Swallow / gulp drop
        const gulpOsc = ctx.createOscillator();
        const gulpGain = ctx.createGain();
        gulpOsc.type = 'sine';
        gulpOsc.frequency.setValueAtTime(340, now);
        gulpOsc.frequency.exponentialRampToValueAtTime(145, now + 0.09);
        gulpGain.gain.setValueAtTime(0.32, now);
        gulpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        gulpOsc.connect(gulpGain);
        gulpGain.connect(sfxGain);
        gulpOsc.start(now);
        gulpOsc.stop(now + 0.1);

        // Bright fruit pop chime
        const popOsc = ctx.createOscillator();
        const popGain = ctx.createGain();
        popOsc.type = 'triangle';
        popOsc.frequency.setValueAtTime(520, now + 0.03);
        popOsc.frequency.exponentialRampToValueAtTime(920, now + 0.11);
        popGain.gain.setValueAtTime(0.34, now + 0.03);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        popOsc.connect(popGain);
        popGain.connect(sfxGain);
        popOsc.start(now + 0.03);
        popOsc.stop(now + 0.14);
      } catch (_) {}
    },

    // 2. Bonus Golden Star Eat Sound (Excited snake hiss + sparkling chime + strong vibration)
    playBonusEat() {
      this.vibrate([45, 30, 65]);
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      try {
        triggerSnakeHiss(0.2, 0.28);
        const now = ctx.currentTime;
        const notes = [659.25, 880, 1318.51]; // E5, A5, E6

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = now + idx * 0.06;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.35, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

          osc.connect(gain);
          gain.connect(sfxGain);

          osc.start(startTime);
          osc.stop(startTime + 0.18);
        });
      } catch (_) {}
    },

    // 3. Collision / Game Over Sound (Angry snake hiss + detuned bass dive + thud + vibration)
    playGameOver() {
      this.vibrate([80, 45, 110]);
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      try {
        triggerSnakeHiss(0.36, 0.42);
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

        gain.gain.setValueAtTime(0.55, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + 0.5);

        ensureNoiseBuffer();
        if (noiseBuffer) {
          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1000, now);
          filter.frequency.exponentialRampToValueAtTime(120, now + 0.25);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.38, now);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(sfxGain);

          noise.start(now);
          noise.stop(now + 0.25);
        }
      } catch (_) {}
    },

    // 4. Subtle UI Click
    playClick() {
      try {
        if (!isSoundEnabled || !isSfxEnabled) return;
        initContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {
        // Audio errors should never block UI interactions
      }
    },

    // 5. Countdown Beeps (3, 2, 1 tick, GO!)
    playCountdown(isGo = false) {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isGo ? 'square' : 'sine';
      const freq = isGo ? 987.77 : 587.33; // B5 for GO, D5 for ticks
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(isGo ? 0.45 : 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isGo ? 0.35 : 0.15));

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + (isGo ? 0.35 : 0.15));
      if (isGo) {
        try { triggerSnakeHiss(0.24, 0.25, 0.04); } catch (_) {}
      }
      this.vibrate(isGo ? 40 : 15);
    },

    // 6. Level Up Ascending Chime
    playLevelUp() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const notes = [440, 554.37, 659.25, 880]; // A major
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(start);
        osc.stop(start + 0.18);
      });
      this.vibrate([25, 25, 40]);
    },

    // 7. Achievement Fanfare
    playAchievement() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    },

    // 8. Obstacle Mode Level Clear Triumphant Fanfare
    playLevelClear() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Radiant brass arpeggio: C5 -> G5 -> C6 -> E6
      const fanfareNotes = [523.25, 783.99, 1046.5, 1318.51];

      fanfareNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.09;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(start);
        osc.stop(start + 0.35);
      });
      this.vibrate([40, 50, 60, 80]);
    },

    // 9. Time Attack Warning Tick
    playTimeTick(isUrgent = false) {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isUrgent ? 'square' : 'sine';
      osc.frequency.setValueAtTime(isUrgent ? 880 : 440, now);

      gain.gain.setValueAtTime(isUrgent ? 0.3 : 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 0.08);
      if (isUrgent) this.vibrate(18);
    },

    // 10. Adventure Power-Up Collect (Cheerful ascending chime)
    playPowerUp() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.045;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.32, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(start);
        osc.stop(start + 0.18);
      });
      this.vibrate([20, 25, 35]);
    },

    // 11. Shield Absorb / Bubble Pop
    playShieldPop() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 0.22);
      this.vibrate(50);
    },

    // 12. Baby Snake Rescue Celebration
    playRescue() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [698.46, 880.00, 1046.50, 1396.91]; // F5, A5, C6, F6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(start);
        osc.stop(start + 0.22);
      });
      this.vibrate([30, 20, 40]);
    },

    // 13. Sweet Coin Clink
    playCoin() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc2.frequency.setValueAtTime(1318.51, now + 0.05); // E6

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(sfxGain);

      osc1.start(now);
      osc1.stop(now + 0.08);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.22);
      this.vibrate(15);
    },

    // 14. Snake Evolution Majestic Fanfare
    playEvolution() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const chords = [
        [523.25, 659.25], // C5, E5
        [659.25, 783.99], // E5, G5
        [783.99, 1046.50], // G5, C6
        [1046.50, 1318.51, 1567.98] // C6, E6, G6
      ];

      chords.forEach((chord, step) => {
        const start = now + step * 0.12;
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.25, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

          osc.connect(gain);
          gain.connect(sfxGain);

          osc.start(start);
          osc.stop(start + 0.45);
        });
      });
      this.vibrate([40, 40, 60, 100]);
    },

    // 15. Cheerful Casual Arcade Background Music Generator
    startBGM() {
      if (!isSoundEnabled || !isBgmEnabled || isBgmPlaying || document.hidden) return;
      initContext();
      if (!ctx) return;

      isBgmPlaying = true;
      bgmStep = 0;

      // 16-step bouncy bassline (D minor / F major casual groove)
      const bassline = [
        146.83, 0, 146.83, 174.61,
        196.00, 0, 174.61, 146.83,
        130.81, 0, 130.81, 164.81,
        174.61, 0, 196.00, 220.00
      ];

      // Cheerful arcade melody lead
      const melodyNotes = [
        587.33, 0, 659.25, 698.46,
        587.33, 523.25, 440.00, 0,
        523.25, 0, 587.33, 659.25,
        523.25, 440.00, 392.00, 440.00
      ];

      if (bgmInterval) {
        clearInterval(bgmInterval);
        bgmInterval = null;
      }

      bgmInterval = setInterval(() => {
        if (!isBgmPlaying || !ctx || !isSoundEnabled || !isBgmEnabled || document.hidden) return;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
          return;
        }
        if (ctx.state !== 'running') return;

        try {
          const now = ctx.currentTime;
          const stepIdx = bgmStep % 16;

          // 1. Warm bouncy bass pulse
          const bassFreq = bassline[stepIdx];
          if (bassFreq > 0) {
            const bassOsc = ctx.createOscillator();
            const bassGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            bassOsc.type = 'triangle';
            bassOsc.frequency.setValueAtTime(bassFreq, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(620, now);

            bassGain.gain.setValueAtTime(0.32, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

            bassOsc.connect(filter);
            filter.connect(bassGain);
            bassGain.connect(bgmGain);

            bassOsc.onended = () => {
              try {
                bassOsc.disconnect();
                filter.disconnect();
                bassGain.disconnect();
              } catch (_) {}
            };

            bassOsc.start(now);
            bassOsc.stop(now + 0.17);
          }

          // 2. Cheerful melody voice
          const melFreq = melodyNotes[stepIdx];
          if (melFreq > 0) {
            const melOsc = ctx.createOscillator();
            const melGain = ctx.createGain();

            melOsc.type = 'sine';
            melOsc.frequency.setValueAtTime(melFreq, now);

            melGain.gain.setValueAtTime(0.18, now);
            melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            melOsc.connect(melGain);
            melGain.connect(bgmGain);

            melOsc.onended = () => {
              try {
                melOsc.disconnect();
                melGain.disconnect();
              } catch (_) {}
            };

            melOsc.start(now);
            melOsc.stop(now + 0.22);
          }

          // 3. Soft hi-hat shaker on off-beats
          if (stepIdx % 2 === 1 && noiseBuffer) {
            const hatSrc = ctx.createBufferSource();
            hatSrc.buffer = noiseBuffer;

            const hatFilter = ctx.createBiquadFilter();
            hatFilter.type = 'highpass';
            hatFilter.frequency.value = 6800;

            const hatGain = ctx.createGain();
            hatGain.gain.setValueAtTime(0.045, now);
            hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

            hatSrc.connect(hatFilter);
            hatFilter.connect(hatGain);
            hatGain.connect(bgmGain);

            hatSrc.onended = () => {
              try {
                hatSrc.disconnect();
                hatFilter.disconnect();
                hatGain.disconnect();
              } catch (_) {}
            };

            hatSrc.start(now);
            hatSrc.stop(now + 0.045);
          }

          bgmStep++;
        } catch (_) {}
      }, 175);
    },

    stopBGM() {
      isBgmPlaying = false;
      if (bgmInterval) {
        clearInterval(bgmInterval);
        bgmInterval = null;
      }
    }
  };
})();
