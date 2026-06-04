import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { WorldBackground } from '../effects/WorldBackground'
import { THEMES } from '../../data/gameData'

export default function SettingsScreen({ onBack, saveData, onUpdateSettings, onReset }) {
  const theme = saveData?.settings?.theme || 'neon'
  const themeData = THEMES[theme] || THEMES.neon
  const [settings, setSettings] = useState(saveData?.settings || {})
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggle(key) {
    setSettings(s => ({ ...s, [key]: !s[key] }))
  }

  function handleSave() {
    onUpdateSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    if (showResetConfirm) {
      onReset()
      setShowResetConfirm(false)
    } else {
      setShowResetConfirm(true)
      setTimeout(() => setShowResetConfirm(false), 4000)
    }
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
          <h2 className="font-display font-bold text-xl" style={{ color: themeData.colors.primary }}>
            ⚙️ SETTINGS
          </h2>
        </div>

        {/* Toggles */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-4">
          <Toggle
            label="Sound Effects"
            emoji="🔊"
            value={settings.soundEnabled !== false}
            onChange={() => toggle('soundEnabled')}
            color={themeData.colors.primary}
          />
          <Toggle
            label="Music"
            emoji="🎵"
            value={settings.musicEnabled !== false}
            onChange={() => toggle('musicEnabled')}
            color={themeData.colors.primary}
          />
          <Toggle
            label="Particles & Effects"
            emoji="✨"
            value={settings.showParticles !== false}
            onChange={() => toggle('showParticles')}
            color={themeData.colors.primary}
          />
        </div>

        {/* Info */}
        <div className="glass rounded-2xl p-4 flex flex-col gap-2">
          <div className="font-display text-xs tracking-widest" style={{ color: themeData.colors.primary }}>SAVE DATA</div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total XP</span>
            <span className="font-display" style={{ color: themeData.colors.primary }}>{saveData?.xp || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Level</span>
            <span className="font-display" style={{ color: themeData.colors.primary }}>{saveData?.level || 1}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Worlds Unlocked</span>
            <span className="font-display" style={{ color: themeData.colors.primary }}>{saveData?.unlockedThemes?.length || 1} / 4</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Pens Unlocked</span>
            <span className="font-display" style={{ color: themeData.colors.primary }}>{saveData?.unlockedPens?.length || 1} / 4</span>
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          className="btn-glow-blue w-full"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saved ? '✅ SAVED!' : '💾 SAVE SETTINGS'}
        </motion.button>

        {/* Reset */}
        <motion.button
          onClick={handleReset}
          className="w-full glass rounded-lg py-3 font-display font-bold text-sm tracking-widest transition-all duration-200"
          style={{
            color: showResetConfirm ? '#ef4444' : '#6b7280',
            borderColor: showResetConfirm ? '#ef444444' : 'rgba(255,255,255,0.07)',
            borderWidth: 1,
            borderStyle: 'solid',
            boxShadow: showResetConfirm ? '0 0 15px #ef444422' : 'none',
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {showResetConfirm ? '⚠️ CONFIRM RESET (IRREVERSIBLE)' : '🗑️ RESET ALL PROGRESS'}
        </motion.button>

        <div className="text-center text-xs text-gray-600 font-display">
          DOTS & BOXES: WORLD CLASH v1.0.0
        </div>
      </div>
    </div>
  )
}

function Toggle({ label, emoji, value, onChange, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{emoji}</span>
        <span className="text-sm text-gray-300">{label}</span>
      </div>
      <button
        onClick={onChange}
        className="relative w-12 h-6 rounded-full transition-all duration-300"
        style={{
          background: value ? color : 'rgba(255,255,255,0.1)',
          boxShadow: value ? `0 0 10px ${color}66` : 'none',
        }}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ left: value ? '1.6rem' : '0.25rem' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </button>
    </div>
  )
}
