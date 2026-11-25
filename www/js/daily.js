/**
 * NEON SNAKE - Daily Missions & 7-Day Calendar Streak Rewards
 * Implements real calendar date-based login streak (Day 1 - Day 7)
 * and daily randomized missions with claimable coin rewards.
 */

const DailySystem = (() => {
  const STREAK_REWARDS = [
    { day: 1, coins: 50, title: 'Day 1: Welcome Gift' },
    { day: 2, coins: 75, title: 'Day 2: Snack Stash' },
    { day: 3, coins: 100, title: 'Day 3: Coin Burst' },
    { day: 4, coins: 150, title: 'Day 4: Treasure Pouch' },
    { day: 5, coins: 200, title: 'Day 5: Golden Chest' },
    { day: 6, coins: 250, title: 'Day 6: Gem Cache' },
    { day: 7, coins: 500, title: 'Day 7: Royal Jackpot + Crown!' }
  ];

  return {
    getStreakRewards() {
      return STREAK_REWARDS;
    },

    getStreakInfo() {
      if (typeof Storage === 'undefined') return { streak: 1, isClaimedToday: false };
      const data = Storage.getDailyLogin();
      const today = new Date().toISOString().slice(0, 10);
      const claimKey = `${today}_day${data.streak || 1}`;
      const isClaimedToday = data.claimedDays ? data.claimedDays.includes(claimKey) : false;

      return {
        streak: Math.max(1, Math.min(7, data.streak || 1)),
        isClaimedToday,
        lastDate: data.lastDate
      };
    },

    claimTodayStreak() {
      if (typeof Storage === 'undefined') return 0;
      const info = this.getStreakInfo();
      if (info.isClaimedToday) return 0;

      const reward = STREAK_REWARDS[info.streak - 1] || STREAK_REWARDS[0];
      const success = Storage.claimDailyLoginReward(info.streak, reward.coins);
      if (success) {
        if (typeof SoundEngine !== 'undefined') {
          SoundEngine.playCoin();
        }
        // If Day 7, also unlock royal crown!
        if (info.streak === 7) {
          Storage.unlockFashionItem('hat_crown');
        }
        return reward.coins;
      }
      return 0;
    },

    getMissions() {
      if (typeof Storage === 'undefined') return [];
      const data = Storage.getDailyMissions();
      return data.missions || [];
    },

    recordEvent(type, count = 1) {
      if (typeof Storage === 'undefined') return;
      if (type === 'food') {
        Storage.updateDailyMissionProgress('eat_20', count);
      } else if (type === 'game') {
        Storage.updateDailyMissionProgress('play_3', count);
      } else if (type === 'rescue') {
        Storage.updateDailyMissionProgress('rescue_1', count);
      } else if (type === 'score') {
        const data = Storage.getDailyMissions();
        data.missions.forEach(m => {
          if (m.id === 'score_300' && !m.claimed && count >= 300) {
            m.current = m.target;
          }
        });
        Storage.saveDailyMissions(data);
      }
    },

    claimMission(missionId) {
      if (typeof Storage === 'undefined') return 0;
      const rewarded = Storage.claimDailyMissionReward(missionId);
      if (rewarded > 0 && typeof SoundEngine !== 'undefined') {
        SoundEngine.playCoin();
      }
      return rewarded;
    }
  };
})();
