/**
 * NEON SNAKE - Snake Fashion Studio
 * Provides unlockable cartoon skins, patterns, hats, and accessories.
 * Renders wearable items in real-time on snake heads across gameplay,
 * studio preview, and the home screen showcase.
 */

const FashionStudio = (() => {
  const SKINS = [
    {
      id: 'skin_green',
      name: 'Classic Meadow',
      cost: 0,
      badge: 'DEFAULT',
      colors: {
        crest: '#85EA46',
        body: '#4ECB23',
        shade: '#26850E',
        belly: '#FFF58A',
        blush: '#FF7E98',
        eyePupil: '#1E1B24'
      }
    },
    {
      id: 'skin_pink',
      name: 'Bubblegum Sugar',
      cost: 150,
      badge: 'CANDY',
      colors: {
        crest: '#FBCFE8',
        body: '#F472B6',
        shade: '#DB2777',
        belly: '#FFF1F2',
        blush: '#FDA4AF',
        eyePupil: '#1E1B24'
      }
    },
    {
      id: 'skin_blue',
      name: 'Sky Dream',
      cost: 180,
      badge: 'COOL',
      colors: {
        crest: '#BAE6FD',
        body: '#38BDF8',
        shade: '#0284C7',
        belly: '#FEF9C3',
        blush: '#F472B6',
        eyePupil: '#0F172A'
      }
    },
    {
      id: 'skin_orange',
      name: 'Sunset Peach',
      cost: 200,
      badge: 'WARM',
      colors: {
        crest: '#FED7AA',
        body: '#FB923C',
        shade: '#EA580C',
        belly: '#FEF08A',
        blush: '#FB7185',
        eyePupil: '#1E1B24'
      }
    },
    {
      id: 'skin_gold',
      name: 'Royal Gold',
      cost: 350,
      badge: 'RARE',
      colors: {
        crest: '#FEF08A',
        body: '#EAB308',
        shade: '#CA8A04',
        belly: '#FEF9C3',
        blush: '#F59E0B',
        eyePupil: '#1E1B24'
      }
    },
    {
      id: 'skin_mint',
      name: 'Minty Fresh',
      cost: 120,
      badge: 'FRESH',
      colors: {
        crest: '#A7F3D0',
        body: '#34D399',
        shade: '#059669',
        belly: '#FFFBEB',
        blush: '#FB7185',
        eyePupil: '#064E3B'
      }
    }
  ];

  const HATS = [
    { id: 'hat_none', name: 'No Hat', cost: 0, badge: 'NATURAL' },
    { id: 'hat_party', name: 'Party Cone', cost: 120, badge: 'PARTY' },
    { id: 'hat_pirate', name: 'Pirate Captain', cost: 220, badge: 'ADVENTURE' },
    { id: 'hat_crown', name: 'Royal Crown', cost: 300, badge: 'ROYAL' },
    { id: 'hat_sunglasses', name: 'Cool Shades', cost: 160, badge: 'SWAG' },
    { id: 'hat_bowtie', name: 'Gentleman Bow', cost: 140, badge: 'CUTE' },
    { id: 'hat_wizard', name: 'Magic Wizard', cost: 250, badge: 'MAGIC' },
    { id: 'hat_flower', name: 'Flower Crown', cost: 180, badge: 'NATURE' }
  ];

  const PATTERNS = [
    { id: 'pattern_smooth', name: 'Smooth Classic', cost: 0 },
    { id: 'pattern_stripes', name: 'Cute Stripes', cost: 100 },
    { id: 'pattern_spots', name: 'Polka Dots', cost: 100 },
    { id: 'pattern_rings', name: 'Neon Rings', cost: 150 }
  ];

  return {
    getSkins() {
      return SKINS;
    },

    getHats() {
      return HATS;
    },

    getPatterns() {
      return PATTERNS;
    },

    getSkin(id) {
      return SKINS.find(s => s.id === id) || SKINS[0];
    },

    getActiveColors() {
      const skinId = (typeof Storage !== 'undefined') ? Storage.getEquippedSkin() : 'skin_green';
      const skin = this.getSkin(skinId);
      return skin.colors;
    },

    getActiveHat() {
      return (typeof Storage !== 'undefined') ? Storage.getEquippedHat() : 'hat_none';
    },

    getActivePattern() {
      return (typeof Storage !== 'undefined') ? Storage.getEquippedPattern() : 'pattern_smooth';
    },

    unlockItem(itemId, cost) {
      if (typeof Storage === 'undefined') return false;
      if (Storage.isFashionUnlocked(itemId)) return true;

      if (Storage.spendCoins(cost)) {
        Storage.unlockFashionItem(itemId);
        if (typeof SoundEngine !== 'undefined') {
          SoundEngine.playAchievement();
        }
        return true;
      }
      return false; // Not enough coins
    },

    // Draw Wearable Hat & Accessories on Snake Head (in local head coordinates)
    drawHatOnHead(ctx, cellSize, hatId, time = 0) {
      if (!hatId || hatId === 'hat_none') return;

      const headLen = cellSize * 0.76;
      const headWidth = cellSize * 0.64;

      ctx.save();

      if (hatId === 'hat_party') {
        // Striped Colorful Party Cone
        const hatBaseX = -headLen * 0.1;
        const hatBaseY = 0;
        const hatHeight = cellSize * 0.65;
        const hatBaseW = headWidth * 0.45;

        // Cone Body
        ctx.fillStyle = '#EC4899';
        ctx.beginPath();
        ctx.moveTo(hatBaseX - hatBaseW * 0.4, -hatBaseW * 0.45);
        ctx.lineTo(hatBaseX - hatBaseW * 0.4, hatBaseW * 0.45);
        ctx.lineTo(hatBaseX - hatHeight, 0); // Cone peak pointing back/up
        ctx.closePath();
        ctx.fill();

        // Yellow and Cyan stripes
        ctx.strokeStyle = '#FDE047';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(hatBaseX - hatHeight * 0.4, -hatBaseW * 0.3);
        ctx.lineTo(hatBaseX - hatHeight * 0.4, hatBaseW * 0.3);
        ctx.stroke();

        ctx.strokeStyle = '#38BDF8';
        ctx.beginPath();
        ctx.moveTo(hatBaseX - hatHeight * 0.7, -hatBaseW * 0.18);
        ctx.lineTo(hatBaseX - hatHeight * 0.7, hatBaseW * 0.18);
        ctx.stroke();

        // Fluffy Pom-Pom at tip
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(hatBaseX - hatHeight, 0, cellSize * 0.1, 0, Math.PI * 2);
        ctx.fill();

      } else if (hatId === 'hat_pirate') {
        // Pirate Captain Tricorn
        const px = -headLen * 0.12;
        const py = 0;
        const pSize = cellSize * 0.55;

        ctx.fillStyle = '#1E1B24';
        ctx.beginPath();
        ctx.ellipse(px, py, pSize * 0.45, pSize * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();

        // Gold Trim
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cute Pirate Crossbone or skull
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px + 2, py, 2.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (hatId === 'hat_crown') {
        // Royal King Golden Crown with sparkling jewels
        const cx = -headLen * 0.12;
        const crownW = headWidth * 0.55;
        const crownH = cellSize * 0.45;

        ctx.fillStyle = '#FBBF24';
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 1.4;

        ctx.beginPath();
        ctx.moveTo(cx, -crownW * 0.5);
        ctx.lineTo(cx - crownH, -crownW * 0.45);
        ctx.lineTo(cx - crownH * 0.4, -crownW * 0.15);
        ctx.lineTo(cx - crownH * 1.15, 0); // Center tall point
        ctx.lineTo(cx - crownH * 0.4, crownW * 0.15);
        ctx.lineTo(cx - crownH, crownW * 0.45);
        ctx.lineTo(cx, crownW * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ruby and Emerald jewel dots
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(cx - crownH * 0.9, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(cx - crownH * 0.75, -crownW * 0.35, 1.8, 0, Math.PI * 2);
        ctx.arc(cx - crownH * 0.75, crownW * 0.35, 1.8, 0, Math.PI * 2);
        ctx.fill();

      } else if (hatId === 'hat_sunglasses') {
        // Cool Dark Sunglasses resting over eyes
        const eyeX = headLen * 0.18;
        const eyeY = headWidth * 0.36;
        const lensW = cellSize * 0.22;
        const lensH = cellSize * 0.18;

        ctx.fillStyle = '#111827';
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1.6;

        // Bridge connecting lenses
        ctx.beginPath();
        ctx.moveTo(eyeX, -eyeY);
        ctx.lineTo(eyeX, eyeY);
        ctx.stroke();

        // Left & Right Lenses
        [-1, 1].forEach(side => {
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(eyeX - lensW * 0.5, eyeY * side - lensH * 0.5, lensW, lensH, 4);
          } else {
            ctx.rect(eyeX - lensW * 0.5, eyeY * side - lensH * 0.5, lensW, lensH);
          }
          ctx.fill();
          ctx.stroke();

          // Cool Lens Reflection diagonal line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(eyeX - lensW * 0.3, eyeY * side - lensH * 0.3);
          ctx.lineTo(eyeX + lensW * 0.2, eyeY * side + lensH * 0.2);
          ctx.stroke();
        });

      } else if (hatId === 'hat_bowtie') {
        // Cute Red Bow Tie situated at the neck
        const bx = -headLen * 0.42;
        const bowH = headWidth * 0.45;
        const bowW = cellSize * 0.22;

        ctx.fillStyle = '#EF4444';
        ctx.strokeStyle = '#B91C1C';
        ctx.lineWidth = 1.2;

        // Left Wing
        ctx.beginPath();
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx - bowW, -bowH * 0.45);
        ctx.lineTo(bx - bowW * 0.6, 0);
        ctx.lineTo(bx - bowW, bowH * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Wing
        ctx.beginPath();
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx + bowW * 0.8, -bowH * 0.45);
        ctx.lineTo(bx + bowW * 0.5, 0);
        ctx.lineTo(bx + bowW * 0.8, bowH * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Center knot
        ctx.fillStyle = '#B91C1C';
        ctx.beginPath();
        ctx.arc(bx, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

      } else if (hatId === 'hat_wizard') {
        // Midnight Blue Sorcerer Wizard Hat
        const wx = -headLen * 0.12;
        const wBase = headWidth * 0.55;
        const wHeight = cellSize * 0.72;

        // Brim
        ctx.fillStyle = '#312E81';
        ctx.beginPath();
        ctx.ellipse(wx, 0, cellSize * 0.15, wBase * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cone
        ctx.fillStyle = '#4338CA';
        ctx.beginPath();
        ctx.moveTo(wx, -wBase * 0.4);
        ctx.lineTo(wx, wBase * 0.4);
        ctx.quadraticCurveTo(wx - wHeight * 0.6, wBase * 0.2, wx - wHeight, -wBase * 0.1);
        ctx.closePath();
        ctx.fill();

        // Golden Moon / Stars
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(wx - wHeight * 0.4, 0, 2.2, 0, Math.PI * 2);
        ctx.fill();

      } else if (hatId === 'hat_flower') {
        // Daisy Flower Garland
        const fx = -headLen * 0.05;
        const fSpread = headWidth * 0.42;

        [-1, 0, 1].forEach(side => {
          const cy = fSpread * side * 0.6;
          // White Daisy Petals
          ctx.fillStyle = '#FFFFFF';
          for (let a = 0; a < 5; a++) {
            const ang = (a / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(fx + Math.cos(ang) * 4, cy + Math.sin(ang) * 4, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          // Yellow Flower Center
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(fx, cy, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    }
  };
})();
