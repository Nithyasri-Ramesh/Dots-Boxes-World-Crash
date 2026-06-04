import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { WorldBackground } from '../effects/WorldBackground'
import { THEMES, AI_DIFFICULTIES, GRID_SIZES, PENS } from '../../data/gameData'

export default function GameSetup({ mode, onStart, onBack, saveData }) {
  const theme = saveData?.settings?.theme || 'neon'
  const themeData = THEMES[theme] || THEMES.neon

  const [config, setConfig] = useState({
    aiDifficulty: saveData?.settings?.aiDifficulty || 'defensive',
    gridSize: saveData?.settings?.gridSize || 4,
    theme: theme,
    pen: saveData?.settings?.pen || 'standard',
    p2Name: 'Player 2',
    p2Avatar: '👾',
  })

  function set(key, val) { setConfig(c => ({ ...c, [key]: val })) }

  const isAI = mode === 'ai'
  const currentTheme = THEMES[config.theme] || themeData

  const unlockedThemes = saveData?.unlockedThemes || ['neon']
  const unlockedPens = saveData?.unlockedPens || ['standard']

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-auto"
      style={{ background: currentTheme.colors.bgGradient }}>
      <WorldBackground themeId={config.theme} />

      <div className="relative z-10 w-full max-w-lg px-4 py-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="glass rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back
          </button>
          <h2 className="font-display font-bold text-xl" style={{ color: currentTheme.colors.primary }}>
            {isAI ? '🤖 VS AI' : '🧑‍🤝‍🧑 VS PLAYER'} — SETUP
          </h2>
        </div>

        {/* AI Difficulty */}
        {isAI && (
          <Section title="AI DIFFICULTY" color={currentTheme.colors.primary}>
            <div className="grid grid-cols-2 gap-2">
              {AI_DIFFICULTIES.map(d => (
                <button
                  key={d.id}
                  onClick={() => set('aiDifficulty', d.id)}
                  className="glass rounded-xl p-3 text-left transition-all duration-200"
                  style={{
                    borderColor: config.aiDifficulty === d.id ? d.color : 'rgba(255,255,255,0.07)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    boxShadow: config.aiDifficulty === d.id ? `0 0 15px ${d.color}44` : 'none',
                  }}
                >
                  <div className="text-xl mb-1">{d.emoji}</div>
                  <div className="font-display text-xs font-bold" style={{ color: d.color }}>{d.name}</div>
                  <div className="text-xs text-gray-400">{d.description}</div>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Player 2 name (PvP) */}
        {!isAI && (
          <Section title="PLAYER 2 NAME" color={currentTheme.colors.secondary}>
            <input
              className="w-full glass rounded-lg px-4 py-2 font-display text-sm outline-none"
              style={{ borderColor: currentTheme.colors.secondary + '60', borderWidth: '1px', borderStyle: 'solid', color: 'white', background: 'transparent' }}
              value={config.p2Name}
              onChange={e => set('p2Name', e.target.value)}
              maxLength={16}
              placeholder="Player 2"
            />
          </Section>
        )}

        {/* Grid size */}
        <Section title="GRID SIZE" color={currentTheme.colors.primary}>
          <div className="grid grid-cols-4 gap-2">
            {GRID_SIZES.map(g => (
              <button
                key={g.id}
                onClick={() => set('gridSize', g.size)}
                className="glass rounded-xl p-2 text-center transition-all duration-200"
                style={{
                  borderColor: config.gridSize === g.size ? currentTheme.colors.primary : 'rgba(255,255,255,0.07)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: config.gridSize === g.size ? `0 0 12px ${currentTheme.colors.primary}44` : 'none',
                }}
              >
                <div className="font-display font-bold text-sm" style={{ color: currentTheme.colors.primary }}>{g.label}</div>
                <div className="text-xs text-gray-400">{g.description}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Theme */}
        <Section title="WORLD THEME" color={currentTheme.colors.primary}>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(THEMES).map(t => {
              const locked = !unlockedThemes.includes(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => !locked && set('theme', t.id)}
                  disabled={locked}
                  className="glass rounded-xl p-3 text-left transition-all duration-200 relative overflow-hidden"
                  style={{
                    borderColor: config.theme === t.id ? t.colors.primary : 'rgba(255,255,255,0.07)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    boxShadow: config.theme === t.id ? `0 0 15px ${t.colors.primary}44` : 'none',
                    opacity: locked ? 0.5 : 1,
                  }}
                >
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <div className="font-display text-xs font-bold" style={{ color: t.colors.primary }}>{t.name}</div>
                  <div className="text-xs text-gray-400">{t.description}</div>
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                      <span className="font-display text-xs text-gray-300">🔒 {t.unlockXP} XP</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Pen */}
        <Section title="PEN STYLE" color={currentTheme.colors.primary}>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(PENS).map(p => {
              const locked = !unlockedPens.includes(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => !locked && set('pen', p.id)}
                  disabled={locked}
                  className="glass rounded-lg p-2 text-left transition-all duration-200 relative"
                  style={{
                    borderColor: config.pen === p.id ? currentTheme.colors.accent : 'rgba(255,255,255,0.07)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    opacity: locked ? 0.5 : 1,
                  }}
                >
                  <span className="text-lg">{p.emoji}</span>
                  <span className="font-display text-xs ml-2" style={{ color: currentTheme.colors.accent }}>{p.name}</span>
                  {locked && <span className="text-xs text-gray-400 ml-1">🔒 {p.unlockXP} XP</span>}
                </button>
              )
            })}
          </div>
        </Section>

        {/* Start */}
        <motion.button
          className="btn-glow-blue w-full py-4 text-base"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStart(config)}
        >
          ⚡ START GAME
        </motion.button>
      </div>
    </div>
  )
}

function Section({ title, color, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-display text-xs font-bold tracking-widest" style={{ color }}>{title}</div>
      {children}
    </div>
  )
}
