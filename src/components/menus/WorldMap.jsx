import React from 'react'
import { motion } from 'framer-motion'
import { WorldBackground } from '../effects/WorldBackground'
import { THEMES } from '../../data/gameData'

const WORLD_ORDER = ['neon', 'ice', 'lava', 'space']

export default function WorldMap({ onBack, saveData, onSelectWorld }) {
  const theme = saveData?.settings?.theme || 'neon'
  const themeData = THEMES[theme] || THEMES.neon
  const unlockedThemes = saveData?.unlockedThemes || ['neon']
  const currentXP = saveData?.xp || 0

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-auto"
      style={{ background: themeData.colors.bgGradient }}>
      <WorldBackground themeId={theme} />

      <div className="relative z-10 w-full max-w-md px-4 py-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="glass rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
          <h2 className="font-display font-bold text-xl shimmer-text">WORLD MAP</h2>
        </div>

        <div className="font-display text-xs text-gray-400 text-center">
          Your XP: <span style={{ color: themeData.colors.primary }}>{currentXP} XP</span>
        </div>

        {/* World nodes */}
        <div className="relative flex flex-col items-center gap-4">
          {WORLD_ORDER.map((worldId, i) => {
            const world = THEMES[worldId]
            const unlocked = unlockedThemes.includes(worldId)
            const isCurrent = theme === worldId
            const xpNeeded = world.unlockXP
            const progress = Math.min(100, xpNeeded > 0 ? (currentXP / xpNeeded) * 100 : 100)

            return (
              <React.Fragment key={worldId}>
                {/* Connection line */}
                {i > 0 && (
                  <motion.div
                    className="w-0.5 h-8"
                    style={{ background: unlocked ? world.colors.primary : 'rgba(255,255,255,0.1)' }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.15 }}
                  />
                )}

                <motion.div
                  className="w-full glass rounded-2xl p-4 relative overflow-hidden cursor-pointer"
                  style={{
                    borderColor: isCurrent ? world.colors.primary : unlocked ? world.colors.primary + '60' : 'rgba(255,255,255,0.07)',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    boxShadow: isCurrent ? `0 0 25px ${world.colors.primary}44` : 'none',
                    opacity: unlocked ? 1 : 0.7,
                  }}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  animate={{ opacity: unlocked ? 1 : 0.7, x: 0 }}
                  transition={{ delay: i * 0.12, type: 'spring' }}
                  onClick={() => unlocked && onSelectWorld(worldId)}
                  whileHover={unlocked ? { scale: 1.02 } : {}}
                  whileTap={unlocked ? { scale: 0.98 } : {}}
                >
                  {/* Glow bg */}
                  {unlocked && (
                    <div className="absolute inset-0 opacity-5" style={{ background: world.colors.primary }} />
                  )}

                  <div className="flex items-center gap-4">
                    {/* World icon */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl"
                        style={{ background: world.colors.primary + '22' }}>
                        {world.emoji}
                      </div>
                      {isCurrent && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                          style={{ background: '#00ff88', boxShadow: '0 0 8px #00ff88' }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-display font-bold text-base" style={{ color: world.colors.primary }}>
                        {world.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{world.description}</div>

                      {unlocked ? (
                        <div className="mt-2 text-xs font-display" style={{ color: '#00ff88' }}>
                          ✅ UNLOCKED {isCurrent ? '· ACTIVE' : ''}
                        </div>
                      ) : (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs font-display mb-1">
                            <span className="text-gray-400">🔒 Unlock at {xpNeeded} XP</span>
                            <span style={{ color: world.colors.primary }}>{Math.round(progress)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: world.colors.primary }}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {unlocked && (
                      <div className="text-gray-400 text-xl">›</div>
                    )}
                  </div>
                </motion.div>
              </React.Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}
