/**
 * NEON SNAKE - Dynamic Environment & Weather System
 * Implements world-specific animated atmosphere & weather:
 * - Forest: Falling leaves, twinkling fireflies & gentle pollen
 * - Candy: Floating sugar sprinkles, bubbly pastel sparkles
 * - Ice: Gently drifting crystalline snowflakes
 * - Desert: Warm golden sand grains and heat shimmer
 * Includes Day/Night cycle and Low-FX toggle for low-end devices.
 */

const WeatherEngine = (() => {
  let particles = [];
  let currentEnvironment = 'forest'; // 'forest', 'candy', 'ice', 'desert', 'classic'
  let dayNightPhase = 0; // 0 to 1 (0 = morning, 0.5 = day, 0.8 = sunset, 1.0 = twilight)
  let isEnabled = true;

  const MAX_PARTICLES = 28;

  function createParticle(w, h, env) {
    const p = {
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 3.5 + 2,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: Math.random() * 0.9 + 0.4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      alpha: Math.random() * 0.6 + 0.3,
      pulse: Math.random() * Math.PI * 2,
      type: env
    };

    if (env === 'candy') {
      const candyColors = ['#F472B6', '#C084FC', '#38BDF8', '#FDE047', '#4ADE80'];
      p.color = candyColors[Math.floor(Math.random() * candyColors.length)];
      p.shape = Math.random() > 0.5 ? 'circle' : 'star';
    } else if (env === 'ice') {
      p.color = '#E0F2FE';
      p.speedY = Math.random() * 1.2 + 0.6;
      p.speedX = Math.sin(p.pulse) * 0.5;
    } else if (env === 'desert') {
      p.color = '#FDE68A';
      p.speedX = Math.random() * 1.5 + 0.8; // Drifting wind
      p.speedY = (Math.random() - 0.3) * 0.4;
      p.size = Math.random() * 2 + 1;
    } else {
      // Forest
      const forestColors = ['#86EFAC', '#4ADE80', '#FDE047', '#FBBF24', '#FB7185'];
      p.color = forestColors[Math.floor(Math.random() * forestColors.length)];
      p.speedY = Math.random() * 0.8 + 0.3;
      p.isFirefly = Math.random() < 0.25;
      if (p.isFirefly) {
        p.color = '#FEF08A';
        p.speedY = (Math.random() - 0.5) * 0.5;
      }
    }

    return p;
  }

  return {
    init(environment = 'forest') {
      const settings = (typeof Storage !== 'undefined') ? Storage.getSettings() : {};
      isEnabled = !settings.lowFx;
      currentEnvironment = environment;
      particles = [];
    },

    setEnvironment(env) {
      currentEnvironment = env;
      particles = [];
    },

    update(deltaTime, width, height) {
      const settings = (typeof Storage !== 'undefined') ? Storage.getSettings() : {};
      isEnabled = !settings.lowFx;
      if (!isEnabled || width <= 0 || height <= 0) return;

      dayNightPhase = (dayNightPhase + deltaTime * 0.000015) % 1.0;

      // Spawn up to MAX_PARTICLES
      while (particles.length < MAX_PARTICLES) {
        particles.push(createParticle(width, height, currentEnvironment));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.pulse += deltaTime * 0.003;
        p.rot += p.rotSpeed;

        if (p.isFirefly) {
          p.x += Math.cos(p.pulse) * 0.6;
          p.y += Math.sin(p.pulse) * 0.6;
        } else {
          p.x += p.speedX;
          p.y += p.speedY;
        }

        // Recycle particles that move outside
        if (p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) {
          particles[i] = createParticle(width, height, currentEnvironment);
          if (currentEnvironment === 'desert') {
            particles[i].x = -5;
          } else {
            particles[i].y = -5;
          }
        }
      }
    },

    draw(ctx, width, height) {
      if (!isEnabled || particles.length === 0) return;

      ctx.save();

      // Ambient time of day overlay tint (Soft twilight transition)
      if (dayNightPhase > 0.65) {
        const twilightIntensity = Math.sin((dayNightPhase - 0.65) / 0.35 * Math.PI) * 0.12;
        ctx.fillStyle = `rgba(30, 27, 75, ${twilightIntensity})`;
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        let alpha = p.alpha;
        if (p.isFirefly) {
          alpha = 0.3 + Math.sin(p.pulse * 3) * 0.4;
          // Soft glow halo
          ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = p.color;

        if (currentEnvironment === 'candy' && p.shape === 'star') {
          // 4-point sparkle star
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.fill();
        } else if (currentEnvironment === 'ice') {
          // 6-point snowflake
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.2;
          for (let arm = 0; arm < 3; arm++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.moveTo(-p.size, 0);
            ctx.lineTo(p.size, 0);
            ctx.stroke();
          }
        } else {
          // Soft falling leaf / pollen / sand pellet
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      ctx.restore();
    }
  };
})();
