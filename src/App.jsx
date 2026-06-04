import React, { useState, useCallback, useEffect, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSaveSystem } from './hooks/useSaveSystem'
import { useSoundSystem } from './hooks/useSoundSystem'
import { THEMES, PENS } from './data/gameData'

import MainMenu from './components/menus/MainMenu'
import GameSetup from './components/menus/GameSetup'
import GameScreen from './components/game/GameScreen'
import ResultScreen from './components/menus/ResultScreen'
import ProfileScreen from './components/menus/ProfileScreen'
import WorldMap from './components/menus/WorldMap'
import DailyChallenges from './components/menus/DailyChallenges'
import SettingsScreen from './components/menus/SettingsScreen'
import OnboardingScreen from './components/menus/OnboardingScreen'

const pageVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 1.02 },
}
const pageTransition = { duration: 0.2, ease: 'easeInOut' }

export default function App() {
  const {
    saveData, addXP, unlockTheme, unlockPen,
    updateStats, updateProfile, updateSettings,
    resetProgress, completeChallenge, todaysChallenges,
  } = useSaveSystem()

  const soundEnabled = saveData?.settings?.soundEnabled !== false
  const sounds = useSoundSystem(soundEnabled)

  const [screen, setScreen]               = useState('loading')
  const [gameMode, setGameMode]           = useState(null)
  const [gameConfig, setGameConfig]       = useState(null)
  const [lastResult, setLastResult]       = useState(null)
  const [activeChallenge, setActiveChallenge] = useState(null)

  // Determine first screen
  useEffect(() => {
    const t = setTimeout(() => {
      setScreen(saveData.firstVisit ? 'onboarding' : 'menu')
    }, 700)
    return () => clearTimeout(t)
  }, [])

  const navigate = useCallback((dest) => {
    sounds.playClick()
    setScreen(dest)
  }, [sounds])

  const handleMenuNav = useCallback((id) => {
    switch (id) {
      case 'pvai':     setGameMode('ai');  navigate('setup');    break
      case 'pvp':      setGameMode('pvp'); navigate('setup');    break
      case 'daily':    navigate('daily');    break
      case 'worldmap': navigate('worldmap'); break
      case 'profile':  navigate('profile');  break
      case 'settings': navigate('settings'); break
    }
  }, [navigate])

  const handleStartGame = useCallback((config) => {
    setGameConfig(config)
    updateSettings({ theme: config.theme, gridSize: config.gridSize, pen: config.pen })
    sounds.playClick()
    setScreen('game')
  }, [updateSettings, sounds])

  const handleStartChallenge = useCallback((challenge) => {
    setActiveChallenge(challenge)
    const config = {
      aiDifficulty: challenge.id === 'aggressive' ? 'aggressive' : 'defensive',
      gridSize: saveData?.settings?.gridSize || 4,
      theme: saveData?.settings?.theme || 'neon',
      pen: saveData?.settings?.pen || 'standard',
    }
    setGameConfig(config)
    setGameMode('ai')
    setScreen('game')
  }, [saveData])

  const handleGameEnd = useCallback((result) => {
    if (!result) { setScreen('menu'); return }

    setLastResult(result)
    result.won ? sounds.playWin() : result.lost ? sounds.playLose() : null

    addXP(result.xp || 0)
    updateStats({
      won: result.won, lost: result.lost, draw: result.draw,
      boxesCaptured: result.boxesCaptured || 0,
      bestCombo: result.bestCombo || 0,
    })

    // Unlock check based on projected new XP
    const newXP = (saveData?.xp || 0) + (result.xp || 0)
    Object.values(THEMES).forEach(t => {
      if (newXP >= t.unlockXP && !saveData?.unlockedThemes?.includes(t.id)) unlockTheme(t.id)
    })
    Object.values(PENS).forEach(p => {
      if (newXP >= p.unlockXP && !saveData?.unlockedPens?.includes(p.id)) unlockPen(p.id)
    })

    // Daily challenge completion
    if (activeChallenge && result.won) {
      completeChallenge(activeChallenge.id, activeChallenge.reward)
      setActiveChallenge(null)
    }

    setScreen('result')
  }, [sounds, addXP, updateStats, saveData, unlockTheme, unlockPen, activeChallenge, completeChallenge])

  const handlePlayAgain = useCallback(() => {
    sounds.playClick()
    setScreen('game')
  }, [sounds])

  const handleOnboardingComplete = useCallback((profile) => {
    updateProfile(profile)
    setScreen('menu')
  }, [updateProfile])

  const handleSelectWorld = useCallback((worldId) => {
    updateSettings({ theme: worldId })
    sounds.playClick()
    setScreen('menu')
  }, [updateSettings, sounds])

  const p1 = saveData?.profile || {}
  const playerNames = gameMode === 'ai'
    ? [p1.name || 'Player 1', `${(gameConfig?.aiDifficulty || 'AI').toUpperCase()} BOT`]
    : [p1.name || 'Player 1', gameConfig?.p2Name || 'Player 2']
  const playerAvatars = gameMode === 'ai'
    ? [p1.avatar || '🧑‍🚀', '🤖']
    : [p1.avatar || '🧑‍🚀', gameConfig?.p2Avatar || '👾']

  // Loading splash
  if (screen === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #050510, #0a0520, #050510)' }}>
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex gap-4">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="rounded-full"
                style={{ width: 14, height: 14, background: '#00f5ff', boxShadow: '0 0 16px #00f5ff' }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, delay: i * 0.22, repeat: Infinity }}
              />
            ))}
          </div>
          <div className="font-display font-black text-3xl shimmer-text">DOTS & BOXES</div>
          <div className="font-display text-sm text-gray-400 tracking-widest">WORLD CLASH</div>
          <div className="w-32 h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full rounded-full bg-cyan-400"
              initial={{ width: '0%' }} animate={{ width: '100%' }}
              transition={{ duration: 0.6, delay: 0.1 }} />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#050510' }}>
      <AnimatePresence mode="wait">
        <motion.div key={screen}
          variants={pageVariants} initial="initial" animate="animate" exit="exit"
          transition={pageTransition} className="min-h-screen">

          {screen === 'onboarding' && (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          )}
          {screen === 'menu' && (
            <MainMenu onNavigate={handleMenuNav} saveData={saveData} />
          )}
          {screen === 'setup' && (
            <GameSetup mode={gameMode} onStart={handleStartGame}
              onBack={() => navigate('menu')} saveData={saveData} />
          )}
          {screen === 'game' && gameConfig && (
            <GameScreen
              gameMode={gameMode}
              aiDifficulty={gameConfig.aiDifficulty}
              gridSize={gameConfig.gridSize}
              theme={gameConfig.theme}
              pen={gameConfig.pen}
              playerNames={playerNames}
              playerAvatars={playerAvatars}
              onGameEnd={handleGameEnd}
              saveData={saveData}
            />
          )}
          {screen === 'result' && lastResult && (
            <ResultScreen
              result={lastResult}
              theme={gameConfig?.theme || 'neon'}
              playerNames={playerNames}
              playerAvatars={playerAvatars}
              onPlayAgain={handlePlayAgain}
              onMainMenu={() => navigate('menu')}
              saveData={saveData}
            />
          )}
          {screen === 'profile' && (
            <ProfileScreen onBack={() => navigate('menu')}
              saveData={saveData} onUpdate={updateProfile} />
          )}
          {screen === 'worldmap' && (
            <WorldMap onBack={() => navigate('menu')}
              saveData={saveData} onSelectWorld={handleSelectWorld} />
          )}
          {screen === 'daily' && (
            <DailyChallenges
              onBack={() => navigate('menu')}
              onStartChallenge={handleStartChallenge}
              saveData={saveData}
              todaysChallenges={todaysChallenges}
            />
          )}
          {screen === 'settings' && (
            <SettingsScreen onBack={() => navigate('menu')}
              saveData={saveData} onUpdateSettings={updateSettings}
              onReset={resetProgress} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
