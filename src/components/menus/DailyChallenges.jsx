import React from 'react'
import { motion } from 'framer-motion'
import { WorldBackground } from '../effects/WorldBackground'
import { THEMES } from '../../data/gameData'

export default function DailyChallenges({ onBack, onStartChallenge, saveData, todaysChallenges }) {
  const theme = saveData?.settings?.theme || 'neon'
  const themeData = THEMES[theme] || THEMES.neon
  const completed = saveData?.dailyChallenges?.completed || []
  const challenges = todaysChallenges || []

  // Format next reset time
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const hoursLeft = Math.ceil((tomorrow - now) / (1000 * 60 * 60))

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-auto"
      style={{ background: themeData.colors.bgGradient }}>
      <WorldBackground themeId={theme} />

      <div className="relative z-10 w-full max-w-md px-4 py-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="glass rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
          <div>
            <h2 className="font-display font-bold text-xl" style={{ color: themeData.colors.primary }}>
              🎯 DAILY CHALLENGES
            </h2>
            <div className="text-xs text-gray-500 font-display">Resets in {hoursLeft}h</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {challenges.length === 0 && (
            <div className="text-center text-gray-400 py-8 font-display text-sm">Loading challenges...</div>
          )}
          {challenges.map((challenge, i) => {
            const done = completed.includes(challenge.id)
            return (
              <motion.div
                key={challenge.id}
                className="glass rounded-2xl p-4 relative overflow-hidden"
                style={{
                  borderColor: done ? '#00ff88' : themeData.colors.primary + '44',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  boxShadow: done ? '0 0 20px #00ff8833' : 'none',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {done && (
                  <div className="absolute inset-0 opacity-5" style={{ background: '#00ff88' }} />
                )}
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{challenge.emoji}</div>
                  <div className="flex-1">
                    <div className="font-display font-bold text-sm" style={{ color: themeData.colors.primary }}>
                      {challenge.title}
                    </div>
                    <div className="text-xs text-gray-300 mt-0.5">{challenge.desc}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-display text-xs px-2 py-0.5 rounded"
                        style={{ background: '#fbbf2422', color: '#fbbf24', border: '1px solid #fbbf2444' }}>
                        +{challenge.reward} XP
                      </span>
                      {done && (
                        <span className="font-display text-xs px-2 py-0.5 rounded"
                          style={{ background: '#00ff8822', color: '#00ff88', border: '1px solid #00ff8844' }}>
                          ✅ COMPLETED
                        </span>
                      )}
                    </div>
                  </div>
                  {!done && (
                    <motion.button
                      className="glass rounded-xl px-3 py-2 font-display text-xs font-bold"
                      style={{ color: themeData.colors.primary, borderColor: themeData.colors.primary + '60', borderWidth: 1, borderStyle: 'solid' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onStartChallenge(challenge)}
                    >
                      PLAY →
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress */}
        <div className="glass rounded-xl p-3 text-center">
          <div className="font-display text-sm" style={{ color: themeData.colors.primary }}>
            {completed.length} / {challenges.length} Completed Today
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: themeData.colors.primary }}
              initial={{ width: 0 }}
              animate={{ width: `${challenges.length > 0 ? (completed.length / challenges.length) * 100 : 0}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
