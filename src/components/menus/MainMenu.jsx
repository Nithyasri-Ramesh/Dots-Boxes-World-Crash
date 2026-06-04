import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WorldBackground } from '../effects/WorldBackground'
import { THEMES } from '../../data/gameData'

const MENU_ITEMS = [
  { id: 'pvai', label: 'VS AI', emoji: '🤖', desc: 'Challenge the machine', color: '#00f5ff' },
  { id: 'pvp', label: 'VS PLAYER', emoji: '🧑‍🤝‍🧑', desc: 'Local multiplayer', color: '#ff00ff' },
  { id: 'daily', label: 'DAILY CHALLENGE', emoji: '🎯', desc: 'New challenges daily', color: '#00ff88' },
  { id: 'worldmap', label: 'WORLD MAP', emoji: '🗺️', desc: 'Explore worlds', color: '#fbbf24' },
  { id: 'profile', label: 'PROFILE', emoji: '🧑‍🚀', desc: 'Customize yourself', color: '#a855f7' },
  { id: 'settings', label: 'SETTINGS', emoji: '⚙️', desc: 'Options & progress', color: '#6366f1' },
]

export default function MainMenu({ onNavigate, saveData }) {
  const [hoveredItem, setHoveredItem] = useState(null)
  const theme = saveData?.settings?.theme || 'neon'
  const themeData = THEMES[theme] || THEMES.neon

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: themeData.colors.bgGradient }}>
      <WorldBackground themeId={theme} />

      <div className="relative z-10 w-full max-w-md px-4 py-8 flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Dots graphic */}
          <div className="flex gap-4 justify-center mb-4">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="rounded-full"
                style={{
                  width: 12,
                  height: 12,
                  background: themeData.colors.primary,
                  boxShadow: `0 0 12px ${themeData.colors.primary}`,
                }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </div>

          <h1 className="font-display font-black leading-none mb-2">
            <span className="block text-4xl md:text-5xl shimmer-text">DOTS & BOXES</span>
            <span className="block text-2xl md:text-3xl mt-1"
              style={{ color: themeData.colors.secondary, textShadow: `0 0 20px ${themeData.colors.secondary}` }}>
              WORLD CLASH
            </span>
          </h1>

          {/* XP / Level bar */}
          <div className="mt-4 glass rounded-lg px-4 py-2 flex items-center gap-3">
            <span className="text-lg">{saveData?.profile?.avatar || '🧑‍🚀'}</span>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-display mb-1">
                <span style={{ color: themeData.colors.primary }}>
                  LVL {saveData?.level || 1} · {saveData?.profile?.name || 'Player'}
                </span>
                <span className="text-gray-400">{saveData?.xp || 0} XP</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: themeData.colors.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((saveData?.xp || 0) % 500) / 5}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu items */}
        <div className="w-full grid grid-cols-1 gap-2">
          {MENU_ITEMS.map((item, i) => (
            <motion.button
              key={item.id}
              className="w-full glass rounded-xl p-3 flex items-center gap-4 text-left transition-all duration-200 active:scale-98"
              style={{
                borderColor: hoveredItem === item.id ? item.color + '80' : 'rgba(255,255,255,0.07)',
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: hoveredItem === item.id ? `0 0 20px ${item.color}33` : 'none',
              }}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onNavigate(item.id)}
            >
              <span className="text-2xl w-10 text-center">{item.emoji}</span>
              <div className="flex-1">
                <div className="font-display font-bold text-sm" style={{ color: item.color }}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
              <motion.span
                className="text-gray-500 text-sm"
                animate={hoveredItem === item.id ? { x: 4 } : { x: 0 }}
              >
                ›
              </motion.span>
            </motion.button>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          className="flex gap-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { label: 'WINS', value: saveData?.stats?.wins || 0, color: '#00ff88' },
            { label: 'GAMES', value: saveData?.stats?.totalGames || 0, color: themeData.colors.primary },
            { label: 'BEST COMBO', value: saveData?.stats?.bestCombo || 0, color: '#fbbf24' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="font-display font-bold text-xl" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="font-display text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
