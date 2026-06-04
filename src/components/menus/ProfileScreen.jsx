import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { WorldBackground } from '../effects/WorldBackground'
import { THEMES, AVATARS, PENS } from '../../data/gameData'

export default function ProfileScreen({ onBack, saveData, onUpdate }) {
  const theme = saveData?.settings?.theme || 'neon'
  const themeData = THEMES[theme] || THEMES.neon
  const [name, setName] = useState(saveData?.profile?.name || 'Player 1')
  const [avatar, setAvatar] = useState(saveData?.profile?.avatar || '🧑‍🚀')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    onUpdate({ name, avatar })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-auto"
      style={{ background: themeData.colors.bgGradient }}>
      <WorldBackground themeId={theme} />

      <div className="relative z-10 w-full max-w-md px-4 py-6 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="glass rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
          <h2 className="font-display font-bold text-xl neon-text-blue">MY PROFILE</h2>
        </div>

        {/* Avatar preview */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-24 h-24 glass rounded-full flex items-center justify-center text-5xl"
            style={{ borderColor: themeData.colors.primary, borderWidth: 2, boxShadow: `0 0 30px ${themeData.colors.primary}44` }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {avatar}
          </motion.div>
          <div className="font-display font-bold text-lg" style={{ color: themeData.colors.primary }}>{name || 'Player'}</div>
        </motion.div>

        {/* Name input */}
        <div className="flex flex-col gap-2">
          <label className="font-display text-xs tracking-widest" style={{ color: themeData.colors.primary }}>PLAYER NAME</label>
          <input
            className="glass rounded-lg px-4 py-3 font-display text-sm outline-none text-white"
            style={{ borderColor: themeData.colors.primary + '60', borderWidth: 1, borderStyle: 'solid', background: 'transparent' }}
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={16}
            placeholder="Enter name..."
          />
        </div>

        {/* Avatar selector */}
        <div className="flex flex-col gap-2">
          <label className="font-display text-xs tracking-widest" style={{ color: themeData.colors.primary }}>AVATAR</label>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map(a => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                className="glass rounded-xl p-2 text-2xl text-center transition-all duration-200"
                style={{
                  borderColor: avatar === a ? themeData.colors.primary : 'rgba(255,255,255,0.07)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  boxShadow: avatar === a ? `0 0 12px ${themeData.colors.primary}55` : 'none',
                  transform: avatar === a ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="glass rounded-2xl p-4 grid grid-cols-2 gap-3">
          <StatRow label="Total Games" value={saveData?.stats?.totalGames || 0} />
          <StatRow label="Total Wins" value={saveData?.stats?.wins || 0} />
          <StatRow label="Total XP" value={saveData?.xp || 0} />
          <StatRow label="Best Combo" value={saveData?.stats?.bestCombo || 0} />
          <StatRow label="Level" value={saveData?.level || 1} />
          <StatRow label="Boxes Captured" value={saveData?.stats?.totalBoxes || 0} />
        </div>

        {/* Unlocked items */}
        <div className="flex flex-col gap-2">
          <div className="font-display text-xs tracking-widest" style={{ color: themeData.colors.accent }}>UNLOCKED PENS</div>
          <div className="flex gap-2 flex-wrap">
            {(saveData?.unlockedPens || ['standard']).map(penId => {
              const pen = PENS[penId]
              return pen ? (
                <div key={penId} className="glass rounded-lg px-3 py-1 text-sm flex items-center gap-1"
                  style={{ borderColor: themeData.colors.accent + '44', borderWidth: 1, borderStyle: 'solid' }}>
                  <span>{pen.emoji}</span>
                  <span className="font-display text-xs" style={{ color: themeData.colors.accent }}>{pen.name}</span>
                </div>
              ) : null
            })}
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          className="btn-glow-green w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saved ? '✅ SAVED!' : '💾 SAVE PROFILE'}
        </motion.button>
      </div>
    </div>
  )
}

function StatRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <div className="text-xs text-gray-400 font-display">{label}</div>
      <div className="font-display font-bold text-lg text-white">{value}</div>
    </div>
  )
}
