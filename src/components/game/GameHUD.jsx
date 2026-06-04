import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { THEMES } from '../../data/gameData'

const REACTION_EMOJIS = ['😎', '😂', '😭', '🔥', '💀', '🎉']

const GameHUD = memo(function GameHUD({
  scores, currentPlayer, playerNames, playerAvatars,
  theme, combo, timeElapsed, totalBoxes,
  isPaused, onPause, onReaction,
}) {
  const themeData = THEMES[theme] || THEMES.neon
  const p1Color = themeData.colors.lineP1
  const p2Color = themeData.colors.lineP2

  function formatTime(s) {
    return `${Math.floor(s / 60).toString().padStart(2,'0')}:${(s % 60).toString().padStart(2,'0')}`
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Score row */}
      <div className="flex items-center justify-between gap-2">
        {/* Player 1 */}
        <PlayerCard
          name={playerNames?.[0] || 'Player 1'}
          avatar={playerAvatars?.[0] || '🧑‍🚀'}
          score={scores[0]}
          isActive={currentPlayer === 0}
          color={p1Color}
          label="YOUR TURN"
        />

        {/* Center controls */}
        <div className="flex flex-col items-center gap-1 px-1 min-w-[52px]">
          <button onClick={onPause}
            className="glass rounded-lg p-2 text-gray-300 hover:text-white transition-colors text-sm w-9 h-9 flex items-center justify-center">
            {isPaused ? '▶' : '⏸'}
          </button>
          <div className="font-display text-xs text-gray-400">{formatTime(timeElapsed)}</div>
          <div className="font-display text-xs text-gray-600">{scores[0]+scores[1]}/{totalBoxes}</div>
        </div>

        {/* Player 2 */}
        <PlayerCard
          name={playerNames?.[1] || 'Player 2'}
          avatar={playerAvatars?.[1] || '🤖'}
          score={scores[1]}
          isActive={currentPlayer === 1}
          color={p2Color}
          label="THEIR TURN"
          reverse
        />
      </div>

      {/* Combo bar */}
      {combo >= 2 && (
        <motion.div className="text-center font-display font-bold text-sm"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          style={{ color: themeData.colors.accent, textShadow: `0 0 10px ${themeData.colors.accent}` }}>
          🔥 COMBO ×{combo}
        </motion.div>
      )}

      {/* Reactions */}
      <div className="flex justify-center gap-3">
        {REACTION_EMOJIS.map(emoji => (
          <button key={emoji} onClick={() => onReaction?.(emoji)}
            className="text-lg hover:scale-125 transition-transform active:scale-95 select-none leading-none">
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
})

const PlayerCard = memo(function PlayerCard({ name, avatar, score, isActive, color, label, reverse }) {
  return (
    <motion.div
      className="flex-1 glass rounded-xl p-2 md:p-3 relative overflow-hidden"
      animate={isActive ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.15 }}
      style={{
        borderColor: isActive ? color : 'rgba(255,255,255,0.07)',
        borderWidth: 1, borderStyle: 'solid',
        boxShadow: isActive ? `0 0 14px ${color}44` : 'none',
      }}
    >
      {isActive && (
        <motion.div className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ background: color }} />
      )}
      <div className={`flex items-center gap-2 ${reverse ? 'flex-row-reverse' : ''}`}>
        <span className="text-xl md:text-2xl">{avatar}</span>
        <div className={reverse ? 'text-right' : ''}>
          <div className="font-display text-xs truncate max-w-[72px]" style={{ color }}>{name}</div>
          <div className="font-display text-lg md:text-2xl font-bold leading-tight" style={{ color }}>{score}</div>
        </div>
        {isActive && (
          <div className={`${reverse ? 'mr-auto' : 'ml-auto'} text-xs font-display px-1.5 py-0.5 rounded whitespace-nowrap`}
            style={{ background: `${color}22`, color }}>
            ▶
          </div>
        )}
      </div>
    </motion.div>
  )
})

export default GameHUD
