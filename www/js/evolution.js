/**
 * NEON SNAKE - Snake Evolution System
 * Implements 5 achievable progression stages:
 * 1. Baby Snake (0 - 200 XP)
 * 2. Junior Snake (200 - 600 XP)
 * 3. Adventure Snake (600 - 1500 XP)
 * 4. Mega Snake (1500 - 3500 XP)
 * 5. Legendary Snake (3500+ XP)
 * Adds evolution progress bars, unlock milestones, and visual prestige enhancements.
 */

const SnakeEvolution = (() => {
  const STAGES = [
    {
      level: 1,
      id: 'baby',
      name: 'Baby Snake',
      minExp: 0,
      maxExp: 200,
      title: 'Little Hatchling',
      desc: 'A tiny, curious green hatchling starting its adventure!',
      perk: '+5 Starting Coin Bonus',
      badgeColor: '#86EFAC',
      visualPerk: 'Cute rosy cheeks & high chirp'
    },
    {
      level: 2,
      id: 'junior',
      name: 'Junior Snake',
      minExp: 200,
      maxExp: 600,
      title: 'Energetic Explorer',
      desc: 'Growing fast, loves sweet apples and exploring new worlds!',
      perk: '+5% Bonus Score on Hard Mode',
      badgeColor: '#38BDF8',
      visualPerk: 'Sporty green crest stripe'
    },
    {
      level: 3,
      id: 'adventure',
      name: 'Adventure Snake',
      minExp: 600,
      maxExp: 1500,
      title: 'Brave Pathfinder',
      desc: 'Master of mazes, rescuer of baby snakes across all 4 worlds!',
      perk: '+10% Longer Power-Up Durations',
      badgeColor: '#F59E0B',
      visualPerk: 'Golden star dust footsteps'
    },
    {
      level: 4,
      id: 'mega',
      name: 'Mega Snake',
      minExp: 1500,
      maxExp: 3500,
      title: 'Colossal Champion',
      desc: 'A powerful, sleek arcade titan with shimmering gloss scales!',
      perk: '+15% Virtual Coin Drops',
      badgeColor: '#A855F7',
      visualPerk: 'Radiant glowing horns'
    },
    {
      level: 5,
      id: 'legendary',
      name: 'Legendary Snake',
      minExp: 3500,
      maxExp: 99999,
      title: 'Mythic Dragon Lord',
      desc: 'The ultimate snake legend! Glowing with royal dragon aura!',
      perk: '20% Boost on All Adventure Rewards',
      badgeColor: '#EF4444',
      visualPerk: 'Dragon horns & celestial star aura'
    }
  ];

  return {
    getStages() {
      return STAGES;
    },

    getCurrentStage() {
      const exp = (typeof Storage !== 'undefined') ? Storage.getEvolutionExp() : 0;
      for (let i = STAGES.length - 1; i >= 0; i--) {
        if (exp >= STAGES[i].minExp) {
          return STAGES[i];
        }
      }
      return STAGES[0];
    },

    getProgress() {
      const exp = (typeof Storage !== 'undefined') ? Storage.getEvolutionExp() : 0;
      const stage = this.getCurrentStage();
      if (stage.level === 5) {
        return { stage, percent: 100, currentExp: exp, nextExp: 3500 };
      }
      const range = stage.maxExp - stage.minExp;
      const curInRange = exp - stage.minExp;
      const percent = Math.min(100, Math.max(0, (curInRange / range) * 100));
      return {
        stage,
        percent: Math.round(percent),
        currentExp: exp,
        nextExp: stage.maxExp
      };
    },

    addExp(amount) {
      if (typeof Storage === 'undefined') return;
      const prevStage = this.getCurrentStage();
      const newExp = Storage.addEvolutionExp(amount);
      const newStage = this.getCurrentStage();

      // Check if evolved to next stage!
      if (newStage.level > prevStage.level) {
        if (typeof SoundEngine !== 'undefined') {
          SoundEngine.playEvolution();
        }
        if (typeof UI !== 'undefined' && UI.showEvolutionCelebration) {
          UI.showEvolutionCelebration(newStage);
        }
      }
      return newExp;
    },

    // Render evolution prestige horns / aura on snake head
    drawEvolutionFeatures(ctx, cellSize, time = 0) {
      const stage = this.getCurrentStage();
      if (stage.level < 4) return; // Mega and Legendary only

      const headLen = cellSize * 0.76;
      const headWidth = cellSize * 0.64;

      ctx.save();

      if (stage.level === 4) {
        // Mega Snake: Twin cute glowing horns
        ctx.fillStyle = '#F59E0B';
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 1.2;

        [-1, 1].forEach(side => {
          ctx.beginPath();
          ctx.moveTo(-headLen * 0.15, headWidth * 0.35 * side);
          ctx.lineTo(-headLen * 0.45, headWidth * 0.55 * side);
          ctx.lineTo(-headLen * 0.3, headWidth * 0.25 * side);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      } else if (stage.level === 5) {
        // Legendary Dragon Horns & Celestial Crest
        ctx.fillStyle = '#EF4444';
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 1.6;

        [-1, 1].forEach(side => {
          ctx.beginPath();
          ctx.moveTo(-headLen * 0.1, headWidth * 0.3 * side);
          ctx.quadraticCurveTo(-headLen * 0.35, headWidth * 0.65 * side, -headLen * 0.6, headWidth * 0.5 * side);
          ctx.lineTo(-headLen * 0.35, headWidth * 0.22 * side);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });

        // Golden Forehead Jewel
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(headLen * 0.22, 0, cellSize * 0.08, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  };
})();
