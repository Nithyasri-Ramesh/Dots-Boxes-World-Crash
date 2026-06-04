import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { WorldBackground } from '../effects/WorldBackground'
import { StarRating, WinConfetti } from '../effects/GameEffects'
import { THEMES } from '../../data/gameData'

export default function ResultScreen({
  result,
  theme,
  playerNames,
  playerAvatars,
  onPlayAgain,
  onMainMenu,
  saveData,
}) {
  const themeData = THEMES[theme] || THEMES.neon
  if (!result) return null

  const { won, lost, draw, scores, stars, xp, timeElapsed, bestCombo, totalBoxes } = result

  const title = won ? 'VICTORY!' : draw ? 'DRAW!' : 'DEFEAT!'
  const titleColor = won ? '#00ff88' : draw ? '#fbbf24' : '#ef4444'
  const emoji = won ? '🏆' : draw ? '🤝' : '💀'

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    return `${m}:${(s % 60).toString().padStart(2, '0')}`
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: themeData.colors.bgGradient }}>
      <WorldBackground themeId={theme} />
      {won && <WinConfetti />}

      <div className="relative z-10 w-full max-w-sm px-4 py-8 flex flex-col items-center gap-6">
        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          <div className="text-6xl mb-2">{emoji}</div>
          <h1 className="font-display font-black text-4xl"
            style={{ color: titleColor, textShadow: `0 0 30px ${titleColor}` }}>
            {title}
          </h1>
        </motion.div>

        {/* Stars */}
        {won && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <StarRating stars={stars} animated />
          </motion.div>
        )}

        {/* Score breakdown */}
        <motion.div
          className="glass rounded-2xl p-5 w-full flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Player scores */}
          <div className="flex justify-around">
            {[0, 1].map(p => (
              <div key={p} className="flex flex-col items-center gap-1">
                <span className="text-3xl">{playerAvatars?.[p] || (p === 0 ? '🧑‍🚀' : '🤖')}</span>
                <div className="font-display text-xs" style={{ color: p === 0 ? themeData.colors.lineP1 : themeData.colors.lineP2 }}>
                  {playerNames?.[p] || `Player ${p + 1}`}
                </div>
                <div className="font-display text-2xl font-bold" style={{ color: p === 0 ? themeData.colors.lineP1 : themeData.colors.lineP2 }}>
                  {scores?.[p] ?? 0}
                </div>
                <div className="text-xs text-gray-400">boxes</div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/10" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="TIME" value={formatTime(timeElapsed || 0)} color={themeData.colors.primary} />
            <Stat label="BEST COMBO" value={`x${bestCombo || 0}`} color="#fbbf24" />
            <Stat label="XP EARNED" value={`+${xp}`} color="#00ff88" />
          </div>

          {/* Win rate */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-display">
              <span style={{ color: themeData.colors.lineP1 }}>P1 Capture Rate</span>
              <span style={{ color: themeData.colors.lineP1 }}>{totalBoxes > 0 ? Math.round(((scores?.[0] || 0) / totalBoxes) * 100) : 0}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: themeData.colors.lineP1 }}
                initial={{ width: 0 }}
                animate={{ width: `${totalBoxes > 0 ? ((scores?.[0] || 0) / totalBoxes) * 100 : 0}%` }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Level up notification */}
        <motion.div
          className="text-center font-display text-sm"
          style={{ color: '#fbbf24' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          ✨ +{xp} XP · Level {saveData?.level || 1}
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <button onClick={onPlayAgain} className="btn-glow-blue w-full">
            🔄 PLAY AGAIN
          </button>
          <button onClick={onMainMenu} className="btn-glow-pink w-full">
            🏠 MAIN MENU
          </button>
        </motion.div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="font-display font-bold text-base" style={{ color }}>{value}</div>
      <div className="font-display text-xs text-gray-400">{label}</div>
    </div>
  )
}
