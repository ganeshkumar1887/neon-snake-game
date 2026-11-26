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
    init() {
      if (typeof Storage !== 'undefined' && Storage.recordDailyLogin) {
        return Storage.recordDailyLogin();
      }
      return { isNewDay: false, streak: 1, totalStreakDays: 1, longestStreak: 1, completed7DayCount: 0, claimedDays: [] };
    },

    getStreakRewards() {
      return STREAK_REWARDS;
    },

    getStreakInfo() {
      if (typeof Storage === 'undefined') {
        return { streak: 1, isClaimedToday: false, totalStreakDays: 1, longestStreak: 1, completed7DayCount: 0 };
      }
      const data = Storage.getDailyLogin();
      const streak = Math.max(1, Math.min(7, data.streak || 1));
      const today = Storage.getTodayDateStr ? Storage.getTodayDateStr() : new Date().toISOString().slice(0, 10);
      const claimKey = `${today}_day${streak}`;
      const isClaimedToday = data.claimedDays ? data.claimedDays.includes(claimKey) : false;

      return {
        streak,
        isClaimedToday,
        lastDate: data.lastDate,
        totalStreakDays: data.totalStreakDays || streak,
        longestStreak: data.longestStreak || streak,
        completed7DayCount: data.completed7DayCount || 0
      };
    },

    claimTodayStreak() {
      if (typeof Storage === 'undefined') return null;
      const info = this.getStreakInfo();
      if (info.isClaimedToday) return null;

      const reward = STREAK_REWARDS[info.streak - 1] || STREAK_REWARDS[0];
      const success = Storage.claimDailyLoginReward(info.streak, reward.coins);
      if (success) {
        let totalCoins = reward.coins;
        let crownUnlocked = false;
        let expEarned = 0;

        // 7-Day Grand Streak Reward!
        if (info.streak === 7) {
          expEarned = 250;
          Storage.addEvolutionExp(expEarned);
          crownUnlocked = Storage.unlockFashionItem('hat_crown');
          if (!crownUnlocked) {
            // Player already owns Royal Crown -> award 200 bonus coins instead
            Storage.addCoins(200);
            totalCoins += 200;
          } else {
            Storage.setEquippedHat('hat_crown');
          }
          if (typeof SoundEngine !== 'undefined') {
            SoundEngine.playEvolution();
          }
        } else if (typeof SoundEngine !== 'undefined') {
          SoundEngine.playCoin();
        }

        return {
          coins: totalCoins,
          day: info.streak,
          isDay7Grand: info.streak === 7,
          crownUnlocked,
          expEarned
        };
      }
      return null;
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
