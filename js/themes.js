/**
 * NEON SNAKE - Casual Pastel Themes Module
 * 6 colorful, cheerful, casual mobile game themes with dynamic CSS variable injection
 * and 2D canvas palette synchronisation.
 * Primary palette: Lavender (#BFA5FF), Peach (#FFC99F), Soft Yellow (#FFE987),
 * Sky Blue (#A9E7EC), Mint Green (#A9EDB0), Coral Red (#FF777D), Cream White (#FFF9E9), Dark Text (#302D35).
 */

const Themes = (() => {
  const THEMES = [
    {
      id: 'pastel-world',
      name: 'Pastel Dream',
      tagline: 'Lavender & Mint Harmony (Default)',
      previewIcon: '<svg viewBox="0 0 24 24" class="svg-theme-icon"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
      accentColor: '#BFA5FF',
      cssVars: {
        '--color-bg-deep': '#FFF9E9',
        '--color-bg-card': '#FFFFFF',
        '--color-bg-card-subtle': '#FAF5FF',
        '--color-board-bg': '#FFFDF8',
        '--color-grid-line': 'rgba(191, 165, 255, 0.14)',
        '--color-text-main': '#302D35',
        '--color-text-muted': '#6B6575',
        '--color-text-dim': '#9891A3',
        '--neon-green': '#A9EDB0',
        '--neon-green-glow': 'rgba(169, 237, 176, 0.5)',
        '--neon-cyan': '#A9E7EC',
        '--neon-cyan-glow': 'rgba(169, 231, 236, 0.5)',
        '--neon-food': '#FF777D',
        '--neon-food-glow': 'rgba(255, 119, 125, 0.4)',
        '--theme-primary': '#BFA5FF',
        '--theme-primary-glow': 'rgba(191, 165, 255, 0.4)',
        '--theme-secondary': '#FFC99F',
        '--theme-accent': '#FFE987',
        '--theme-card-border': '#EADBFF'
      },
      palette: {
        crest: '#E4D6FF',
        body: '#BFA5FF',
        shade: '#9875E6',
        belly: '#F4EEFF',
        scaleStroke: 'rgba(255, 255, 255, 0.65)',
        scaleFillEven: 'rgba(169, 231, 236, 0.45)',
        scaleFillOdd: 'rgba(169, 237, 176, 0.45)',
        blush: '#FF85A1',
        eyeCornea: '#302D35',
        eyePupil: '#1A181E',
        eyeHighlight: '#FFFFFF',
        tongue: '#FF777D',
        food: '#FF777D',
        foodLeaf: '#4ADE80',
        foodGlow: 'rgba(255, 119, 125, 0.45)',
        bonus: '#FFE987',
        bonusGlow: 'rgba(255, 233, 135, 0.6)',
        boardBg: '#FFFDF8',
        gridLine: 'rgba(191, 165, 255, 0.12)',
        obstacleFill: '#EADBFF',
        obstacleBorder: '#BFA5FF',
        obstacleGlow: 'rgba(191, 165, 255, 0.4)'
      }
    },
    {
      id: 'candy-world',
      name: 'Cotton Candy',
      tagline: 'Sweet Bubblegum & Peach Sugar',
      previewIcon: '<svg viewBox="0 0 24 24" class="svg-theme-icon"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      accentColor: '#FF85A1',
      cssVars: {
        '--color-bg-deep': '#FFF5F8',
        '--color-bg-card': '#FFFFFF',
        '--color-bg-card-subtle': '#FFF0F4',
        '--color-board-bg': '#FFFDFC',
        '--color-grid-line': 'rgba(255, 133, 161, 0.14)',
        '--color-text-main': '#302D35',
        '--color-text-muted': '#6E5C64',
        '--color-text-dim': '#A38B95',
        '--neon-green': '#FF85A1',
        '--neon-green-glow': 'rgba(255, 133, 161, 0.5)',
        '--neon-cyan': '#CDB4DB',
        '--neon-cyan-glow': 'rgba(205, 180, 219, 0.5)',
        '--neon-food': '#FF777D',
        '--neon-food-glow': 'rgba(255, 119, 125, 0.4)',
        '--theme-primary': '#FF85A1',
        '--theme-primary-glow': 'rgba(255, 133, 161, 0.4)',
        '--theme-secondary': '#FFC99F',
        '--theme-accent': '#FFE987',
        '--theme-card-border': '#FFD1DC'
      },
      palette: {
        crest: '#FFD4DE',
        body: '#FF85A1',
        shade: '#D85474',
        belly: '#FFF0F4',
        scaleStroke: 'rgba(255, 255, 255, 0.7)',
        scaleFillEven: 'rgba(255, 201, 159, 0.5)',
        scaleFillOdd: 'rgba(205, 180, 219, 0.5)',
        blush: '#FF5E85',
        eyeCornea: '#302D35',
        eyePupil: '#1A181E',
        eyeHighlight: '#FFFFFF',
        tongue: '#FF777D',
        food: '#FF777D',
        foodLeaf: '#52B788',
        foodGlow: 'rgba(255, 119, 125, 0.45)',
        bonus: '#FFE987',
        bonusGlow: 'rgba(255, 233, 135, 0.6)',
        boardBg: '#FFFDFC',
        gridLine: 'rgba(255, 133, 161, 0.12)',
        obstacleFill: '#FFE5EC',
        obstacleBorder: '#FF85A1',
        obstacleGlow: 'rgba(255, 133, 161, 0.4)'
      }
    },
    {
      id: 'ocean-world',
      name: 'Sky Lagoon',
      tagline: 'Refreshing Sky Blue & Mint Waves',
      previewIcon: '<svg viewBox="0 0 24 24" class="svg-theme-icon"><path fill="currentColor" d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      accentColor: '#A9E7EC',
      cssVars: {
        '--color-bg-deep': '#F0FBFC',
        '--color-bg-card': '#FFFFFF',
        '--color-bg-card-subtle': '#EAF7F9',
        '--color-board-bg': '#F8FEFF',
        '--color-grid-line': 'rgba(169, 231, 236, 0.22)',
        '--color-text-main': '#253538',
        '--color-text-muted': '#586E72',
        '--color-text-dim': '#87A0A4',
        '--neon-green': '#A9E7EC',
        '--neon-green-glow': 'rgba(169, 231, 236, 0.5)',
        '--neon-cyan': '#48CAE4',
        '--neon-cyan-glow': 'rgba(72, 202, 228, 0.5)',
        '--neon-food': '#FF777D',
        '--neon-food-glow': 'rgba(255, 119, 125, 0.45)',
        '--theme-primary': '#48CAE4',
        '--theme-primary-glow': 'rgba(72, 202, 228, 0.4)',
        '--theme-secondary': '#A9E7EC',
        '--theme-accent': '#FFE987',
        '--theme-card-border': '#CEF3F6'
      },
      palette: {
        crest: '#D5F7FA',
        body: '#38BDF8',
        shade: '#0284C7',
        belly: '#E6FAFC',
        scaleStroke: 'rgba(255, 255, 255, 0.7)',
        scaleFillEven: 'rgba(169, 237, 176, 0.5)',
        scaleFillOdd: 'rgba(191, 165, 255, 0.4)',
        blush: '#FF85A1',
        eyeCornea: '#253538',
        eyePupil: '#142022',
        eyeHighlight: '#FFFFFF',
        tongue: '#FF777D',
        food: '#FF777D',
        foodLeaf: '#38BDF8',
        foodGlow: 'rgba(255, 119, 125, 0.45)',
        bonus: '#FFE987',
        bonusGlow: 'rgba(255, 233, 135, 0.65)',
        boardBg: '#F8FEFF',
        gridLine: 'rgba(72, 202, 228, 0.12)',
        obstacleFill: '#E0F7FA',
        obstacleBorder: '#48CAE4',
        obstacleGlow: 'rgba(72, 202, 228, 0.4)'
      }
    },
    {
      id: 'forest-world',
      name: 'Mint Garden',
      tagline: 'Lush Mint Green & Sunny Yellow',
      previewIcon: '<svg viewBox="0 0 24 24" class="svg-theme-icon"><path fill="currentColor" d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>',
      accentColor: '#A9EDB0',
      cssVars: {
        '--color-bg-deep': '#F2FBF4',
        '--color-bg-card': '#FFFFFF',
        '--color-bg-card-subtle': '#E8F8EB',
        '--color-board-bg': '#FAFFFB',
        '--color-grid-line': 'rgba(169, 237, 176, 0.22)',
        '--color-text-main': '#263629',
        '--color-text-muted': '#556E58',
        '--color-text-dim': '#87A48A',
        '--neon-green': '#A9EDB0',
        '--neon-green-glow': 'rgba(169, 237, 176, 0.5)',
        '--neon-cyan': '#52B788',
        '--neon-cyan-glow': 'rgba(82, 183, 136, 0.5)',
        '--neon-food': '#FF777D',
        '--neon-food-glow': 'rgba(255, 119, 125, 0.45)',
        '--theme-primary': '#52B788',
        '--theme-primary-glow': 'rgba(82, 183, 136, 0.4)',
        '--theme-secondary': '#A9EDB0',
        '--theme-accent': '#FFE987',
        '--theme-card-border': '#D0F6D5'
      },
      palette: {
        crest: '#D8FCE0',
        body: '#52B788',
        shade: '#2D7553',
        belly: '#EDFDF1',
        scaleStroke: 'rgba(255, 255, 255, 0.7)',
        scaleFillEven: 'rgba(255, 233, 135, 0.55)',
        scaleFillOdd: 'rgba(169, 231, 236, 0.5)',
        blush: '#FF85A1',
        eyeCornea: '#263629',
        eyePupil: '#162218',
        eyeHighlight: '#FFFFFF',
        tongue: '#FF777D',
        food: '#FF777D',
        foodLeaf: '#2D7553',
        foodGlow: 'rgba(255, 119, 125, 0.45)',
        bonus: '#FFE987',
        bonusGlow: 'rgba(255, 233, 135, 0.65)',
        boardBg: '#FAFFFB',
        gridLine: 'rgba(82, 183, 136, 0.12)',
        obstacleFill: '#E4F9E8',
        obstacleBorder: '#52B788',
        obstacleGlow: 'rgba(82, 183, 136, 0.4)'
      }
    },
    {
      id: 'sunset-world',
      name: 'Peach Sunset',
      tagline: 'Warm Peach, Coral & Golden Glow',
      previewIcon: '<svg viewBox="0 0 24 24" class="svg-theme-icon"><path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>',
      accentColor: '#FFC99F',
      cssVars: {
        '--color-bg-deep': '#FFF7F0',
        '--color-bg-card': '#FFFFFF',
        '--color-bg-card-subtle': '#FFF0E4',
        '--color-board-bg': '#FFFDFB',
        '--color-grid-line': 'rgba(255, 201, 159, 0.22)',
        '--color-text-main': '#382D28',
        '--color-text-muted': '#725E55',
        '--color-text-dim': '#A68F85',
        '--neon-green': '#FFC99F',
        '--neon-green-glow': 'rgba(255, 201, 159, 0.5)',
        '--neon-cyan': '#FF777D',
        '--neon-cyan-glow': 'rgba(255, 119, 125, 0.5)',
        '--neon-food': '#FF777D',
        '--neon-food-glow': 'rgba(255, 119, 125, 0.45)',
        '--theme-primary': '#FF9671',
        '--theme-primary-glow': 'rgba(255, 150, 113, 0.4)',
        '--theme-secondary': '#FFC99F',
        '--theme-accent': '#FFE987',
        '--theme-card-border': '#FFE3CC'
      },
      palette: {
        crest: '#FFE5D1',
        body: '#FF9671',
        shade: '#D6572E',
        belly: '#FFF4EB',
        scaleStroke: 'rgba(255, 255, 255, 0.7)',
        scaleFillEven: 'rgba(255, 233, 135, 0.55)',
        scaleFillOdd: 'rgba(191, 165, 255, 0.45)',
        blush: '#FF5E85',
        eyeCornea: '#382D28',
        eyePupil: '#221915',
        eyeHighlight: '#FFFFFF',
        tongue: '#FF777D',
        food: '#FF777D',
        foodLeaf: '#52B788',
        foodGlow: 'rgba(255, 119, 125, 0.45)',
        bonus: '#FFE987',
        bonusGlow: 'rgba(255, 233, 135, 0.65)',
        boardBg: '#FFFDFB',
        gridLine: 'rgba(255, 150, 113, 0.12)',
        obstacleFill: '#FFE8DA',
        obstacleBorder: '#FF9671',
        obstacleGlow: 'rgba(255, 150, 113, 0.4)'
      }
    },
    {
      id: 'retro-arcade',
      name: 'Pastel Arcade',
      tagline: 'Playful Lilac & Electric Violet',
      previewIcon: '<svg viewBox="0 0 24 24" class="svg-theme-icon"><path fill="currentColor" d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>',
      accentColor: '#BFA5FF',
      cssVars: {
        '--color-bg-deep': '#F8F6FF',
        '--color-bg-card': '#FFFFFF',
        '--color-bg-card-subtle': '#F1ECFF',
        '--color-board-bg': '#FCFAFF',
        '--color-grid-line': 'rgba(191, 165, 255, 0.2)',
        '--color-text-main': '#2E283D',
        '--color-text-muted': '#655A7E',
        '--color-text-dim': '#988BB5',
        '--neon-green': '#BFA5FF',
        '--neon-green-glow': 'rgba(191, 165, 255, 0.5)',
        '--neon-cyan': '#A9E7EC',
        '--neon-cyan-glow': 'rgba(169, 231, 236, 0.5)',
        '--neon-food': '#FF777D',
        '--neon-food-glow': 'rgba(255, 119, 125, 0.45)',
        '--theme-primary': '#8B5CF6',
        '--theme-primary-glow': 'rgba(139, 92, 246, 0.4)',
        '--theme-secondary': '#A9E7EC',
        '--theme-accent': '#FFE987',
        '--theme-card-border': '#E4DAFF'
      },
      palette: {
        crest: '#E7DCFF',
        body: '#8B5CF6',
        shade: '#5B21B6',
        belly: '#F5F0FF',
        scaleStroke: 'rgba(255, 255, 255, 0.7)',
        scaleFillEven: 'rgba(169, 231, 236, 0.55)',
        scaleFillOdd: 'rgba(169, 237, 176, 0.5)',
        blush: '#FF85A1',
        eyeCornea: '#2E283D',
        eyePupil: '#191522',
        eyeHighlight: '#FFFFFF',
        tongue: '#FF777D',
        food: '#FF777D',
        foodLeaf: '#52B788',
        foodGlow: 'rgba(255, 119, 125, 0.45)',
        bonus: '#FFE987',
        bonusGlow: 'rgba(255, 233, 135, 0.65)',
        boardBg: '#FCFAFF',
        gridLine: 'rgba(139, 92, 246, 0.12)',
        obstacleFill: '#ECE4FF',
        obstacleBorder: '#8B5CF6',
        obstacleGlow: 'rgba(139, 92, 246, 0.4)'
      }
    }
  ];

  let currentThemeId = 'pastel-world';

  // Apply theme CSS variables to document root
  const injectCssVars = (vars) => {
    const root = document.documentElement;
    Object.entries(vars).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });
  };

  return {
    init() {
      // Load saved theme or fall back to default pastel dream
      let saved = 'pastel-world';
      try {
        if (typeof Storage !== 'undefined' && Storage.getTheme) {
          saved = Storage.getTheme();
        }
      } catch (e) {
        console.warn('Storage unavailable in Themes.init:', e);
      }

      const match = THEMES.find(t => t.id === saved);
      this.apply(match ? match.id : 'pastel-world', false);
    },

    getAll() {
      return THEMES;
    },

    getCurrentId() {
      return currentThemeId;
    },

    getDefaultThemeId() {
      return 'pastel-world';
    },

    getCurrentTheme() {
      return THEMES.find(t => t.id === currentThemeId) || THEMES[0];
    },

    getPalette() {
      const theme = this.getCurrentTheme();
      return theme.palette;
    },

    apply(themeId, saveToStorage = true) {
      const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
      currentThemeId = theme.id;

      injectCssVars(theme.cssVars);

      if (saveToStorage) {
        try {
          if (typeof Storage !== 'undefined' && Storage.saveTheme) {
            Storage.saveTheme(theme.id);
          }
        } catch (e) {
          console.warn('Could not save theme:', e);
        }
      }

      // Sync active state in document
      document.documentElement.setAttribute('data-theme', theme.id);
    },

    preview(themeId) {
      const theme = THEMES.find(t => t.id === themeId);
      if (theme) {
        injectCssVars(theme.cssVars);
      }
    }
  };
})();
