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

  let isSoundEnabled = true;
  let isSfxEnabled = true;
  let isBgmEnabled = true;
  let masterVolume = 0.8;

  let isBgmPlaying = false;
  let bgmInterval = null;
  let bgmStep = 0;

  // Initialize Audio Context on first user interaction
  const initContext = () => {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      ctx = new AudioCtx();

      masterGain = ctx.createGain();
      masterGain.gain.value = isSoundEnabled ? masterVolume : 0;
      masterGain.connect(ctx.destination);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = isSfxEnabled ? 0.9 : 0;
      sfxGain.connect(masterGain);

      bgmGain = ctx.createGain();
      bgmGain.gain.value = isBgmEnabled ? 0.22 : 0;
      bgmGain.connect(masterGain);
    }

    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  };

  return {
    init() {
      const settings = (typeof Storage !== 'undefined') ? Storage.getSettings() : {};
      isSoundEnabled = settings.soundEnabled ?? true;
      isSfxEnabled = settings.sfxEnabled ?? true;
      isBgmEnabled = settings.bgmEnabled ?? true;
      masterVolume = (typeof settings.volume === 'number') ? settings.volume : 0.8;

      // Unlock Web Audio context on the first user interaction
      const unlockAudio = () => {
        initContext();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
      window.addEventListener('touchstart', unlockAudio, { once: true });
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
        sfxGain.gain.setValueAtTime(isSfxEnabled ? 0.9 : 0, ctx.currentTime);
      }
    },

    setBgmEnabled(enabled) {
      isBgmEnabled = !!enabled;
      if (bgmGain && ctx) {
        bgmGain.gain.setValueAtTime(isBgmEnabled ? 0.22 : 0, ctx.currentTime);
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

    vibrate(pattern = 15) {
      const settings = (typeof Storage !== 'undefined') ? Storage.getSettings() : {};
      if (settings.vibration !== false && navigator.vibrate) {
        try {
          navigator.vibrate(pattern);
        } catch (e) {}
      }
    },

    // 1. Eat Food Sound (Rising dual neon tone)
    playEat() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 0.12);
      this.vibrate(15);
    },

    // 2. Bonus Golden Star Eat Sound (Triple sparkling chime)
    playBonusEat() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

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
      this.vibrate([20, 30, 40]);
    },

    // 3. Collision / Game Over Sound (Detuned bass crash & descending dive)
    playGameOver() {
      if (!isSoundEnabled || !isSfxEnabled) return;
      initContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 0.5);

      try {
        const bufferSize = ctx.sampleRate * 0.25;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + 0.25);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.4, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(sfxGain);

        noise.start(now);
        noise.stop(now + 0.25);
      } catch (e) {}

      this.vibrate([60, 40, 90]);
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

    // 15. Synthwave Ambient BGM Generator
    startBGM() {
      if (!isSoundEnabled || !isBgmEnabled || isBgmPlaying) return;
      initContext();
      if (!ctx) return;

      isBgmPlaying = true;
      bgmStep = 0;

      const bassline = [
        146.83, 146.83, 174.61, 146.83, 
        196.00, 146.83, 220.00, 174.61
      ];

      const arpNotes = [
        293.66, 349.23, 440.00, 523.25,
        440.00, 349.23, 587.33, 440.00
      ];

      bgmInterval = setInterval(() => {
        if (!isBgmPlaying || !ctx || !isSoundEnabled || !isBgmEnabled) return;

        const now = ctx.currentTime;

        // Bass pulse
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassline[bgmStep % bassline.length], now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        bassGain.gain.setValueAtTime(0.25, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        bassOsc.connect(filter);
        filter.connect(bassGain);
        bassGain.connect(bgmGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.16);

        // Soft arp
        if (bgmStep % 2 === 0) {
          const arpOsc = ctx.createOscillator();
          const arpGain = ctx.createGain();

          arpOsc.type = 'sine';
          arpOsc.frequency.setValueAtTime(arpNotes[Math.floor(bgmStep / 2) % arpNotes.length], now);

          arpGain.gain.setValueAtTime(0.12, now);
          arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          arpOsc.connect(arpGain);
          arpGain.connect(bgmGain);

          arpOsc.start(now);
          arpOsc.stop(now + 0.25);
        }

        bgmStep++;
      }, 160);
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
