import { useState, useCallback, useEffect } from 'react'
import { DAILY_CHALLENGES } from '../data/gameData'

const DEFAULT_SAVE = {
  xp: 0,
  level: 1,
  unlockedThemes: ['neon'],
  unlockedPens: ['standard'],
  profile: {
    name: 'Player 1',
    avatar: '🧑‍🚀',
    favoritePen: 'standard',
    favoriteTheme: 'neon',
  },
  stats: {
    wins: 0,
    losses: 0,
    draws: 0,
    totalGames: 0,
    totalBoxes: 0,
    bestCombo: 0,
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    theme: 'neon',
    gridSize: 4,
    showParticles: true,
    pen: 'standard',
  },
  dailyChallenges: {
    completed: [],
    lastRefresh: null,   // stored as 'YYYY-MM-DD'
    todaysChallenges: [], // indices into DAILY_CHALLENGES
  },
  firstVisit: true,
}

const XP_PER_LEVEL = 500

// Get today's date string e.g. "2025-06-03"
function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// Pick 3 deterministic-but-daily challenges using date as seed
function pickTodaysChallenges(dateStr) {
  // Simple seeded shuffle using date digits as seed
  let seed = dateStr.replace(/-/g, '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff }
  const indices = DAILY_CHALLENGES.map((_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices.slice(0, 3)
}

function refreshDailyChallengesIfNeeded(data) {
  const today = todayStr()
  if (data.dailyChallenges?.lastRefresh === today) return data
  // New day — reset completed and pick new challenges
  return {
    ...data,
    dailyChallenges: {
      completed: [],
      lastRefresh: today,
      todaysChallenges: pickTodaysChallenges(today),
    }
  }
}

export function useSaveSystem() {
  const [saveData, setSaveData] = useState(() => {
    try {
      const stored = localStorage.getItem('dots_boxes_save')
      if (stored) {
        const parsed = JSON.parse(stored)
        const merged = {
          ...DEFAULT_SAVE, ...parsed,
          profile: { ...DEFAULT_SAVE.profile, ...parsed.profile },
          stats: { ...DEFAULT_SAVE.stats, ...parsed.stats },
          settings: { ...DEFAULT_SAVE.settings, ...parsed.settings },
          dailyChallenges: { ...DEFAULT_SAVE.dailyChallenges, ...parsed.dailyChallenges },
        }
        return refreshDailyChallengesIfNeeded(merged)
      }
    } catch {}
    const fresh = refreshDailyChallengesIfNeeded(DEFAULT_SAVE)
    return fresh
  })

  // Persist whenever saveData changes
  useEffect(() => {
    try {
      localStorage.setItem('dots_boxes_save', JSON.stringify(saveData))
    } catch {}
  }, [saveData])

  const save = useCallback((updater) => {
    setSaveData(prev => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater })
  }, [])

  const addXP = useCallback((amount) => {
    save(prev => {
      const newXP = prev.xp + amount
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1
      return { ...prev, xp: newXP, level: newLevel }
    })
  }, [save])

  const unlockTheme = useCallback((themeId) => {
    save(prev => ({
      ...prev,
      unlockedThemes: prev.unlockedThemes.includes(themeId)
        ? prev.unlockedThemes
        : [...prev.unlockedThemes, themeId]
    }))
  }, [save])

  const unlockPen = useCallback((penId) => {
    save(prev => ({
      ...prev,
      unlockedPens: prev.unlockedPens.includes(penId)
        ? prev.unlockedPens
        : [...prev.unlockedPens, penId]
    }))
  }, [save])

  const updateStats = useCallback((gameResult) => {
    save(prev => {
      const s = prev.stats
      return {
        ...prev,
        stats: {
          ...s,
          wins: s.wins + (gameResult.won ? 1 : 0),
          losses: s.losses + (gameResult.lost ? 1 : 0),
          draws: s.draws + (gameResult.draw ? 1 : 0),
          totalGames: s.totalGames + 1,
          totalBoxes: s.totalBoxes + (gameResult.boxesCaptured || 0),
          bestCombo: Math.max(s.bestCombo, gameResult.bestCombo || 0),
        }
      }
    })
  }, [save])

  const updateProfile = useCallback((profile) => {
    save(prev => ({ ...prev, profile: { ...prev.profile, ...profile }, firstVisit: false }))
  }, [save])

  const updateSettings = useCallback((settings) => {
    save(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }))
  }, [save])

  const resetProgress = useCallback(() => {
    localStorage.removeItem('dots_boxes_save')
    setSaveData(refreshDailyChallengesIfNeeded(DEFAULT_SAVE))
  }, [])

  const completeChallenge = useCallback((challengeId, xpReward) => {
    save(prev => {
      if (prev.dailyChallenges.completed.includes(challengeId)) return prev
      return {
        ...prev,
        xp: prev.xp + xpReward,
        level: Math.floor((prev.xp + xpReward) / XP_PER_LEVEL) + 1,
        dailyChallenges: {
          ...prev.dailyChallenges,
          completed: [...prev.dailyChallenges.completed, challengeId]
        }
      }
    })
  }, [save])

  // Get today's 3 challenge objects
  const todaysChallenges = (saveData.dailyChallenges?.todaysChallenges || [])
    .map(i => DAILY_CHALLENGES[i])
    .filter(Boolean)

  const xpToNextLevel = XP_PER_LEVEL - (saveData.xp % XP_PER_LEVEL)
  const xpProgress = ((saveData.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100

  return {
    saveData,
    addXP,
    unlockTheme,
    unlockPen,
    updateStats,
    updateProfile,
    updateSettings,
    resetProgress,
    completeChallenge,
    todaysChallenges,
    xpToNextLevel,
    xpProgress,
  }
}
