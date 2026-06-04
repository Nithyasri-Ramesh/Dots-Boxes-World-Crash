import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Combo popup
export function ComboEffect({ combo, position, theme }) {
  if (!combo || combo < 2) return null
  const color = theme?.colors?.primary || '#00f5ff'
  const labels = ['', '', 'DOUBLE!', 'TRIPLE!', 'QUAD!', 'PENTA!', 'ULTRA!!', 'GODLIKE!!!']
  const label = labels[Math.min(combo, labels.length - 1)] || `x${combo} COMBO!`

  return (
    <motion.div
      key={combo}
      className="absolute pointer-events-none z-50 flex flex-col items-center"
      style={{ left: '50%', top: '40%', transform: 'translateX(-50%)' }}
      initial={{ opacity: 0, scale: 0.3, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.4, 1.2, 0.8], y: [0, -20, -60, -100] }}
      transition={{ duration: 1.4, times: [0, 0.2, 0.7, 1] }}
    >
      <div className="font-display font-black text-2xl md:text-4xl whitespace-nowrap"
        style={{ color, textShadow: `0 0 20px ${color}, 0 0 40px ${color}` }}>
        {label}
      </div>
      <div className="font-display text-sm tracking-widest mt-1" style={{ color, opacity: 0.8 }}>
        +{combo * 10} XP BONUS
      </div>
    </motion.div>
  )
}

// Floating emoji reaction
export function EmojiReaction({ emoji, id, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [onDone])

  const xOffset = (Math.random() - 0.5) * 100

  return (
    <motion.div
      className="fixed pointer-events-none z-50 text-4xl"
      style={{ bottom: '30%', left: '50%' }}
      initial={{ opacity: 0, scale: 0, x: xOffset, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.4, 1.2, 0.8], y: [0, -60, -120, -180] }}
      transition={{ duration: 2, times: [0, 0.15, 0.7, 1] }}
    >
      {emoji}
    </motion.div>
  )
}

// Box capture sparkles
export function CaptureSparkles({ x, y, color, id }) {
  const particles = [...Array(8)].map((_, i) => ({
    angle: (i / 8) * Math.PI * 2,
    distance: 30 + Math.random() * 30,
    size: 3 + Math.random() * 5,
  }))

  return (
    <motion.div
      className="absolute pointer-events-none z-40"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 6px ${color}`,
            left: 0,
            top: 0,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  )
}

// Screen flash on combo
export function ScreenFlash({ color, intensity = 0.15 }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-30"
      style={{ background: color }}
      initial={{ opacity: intensity }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    />
  )
}

// Turn indicator pulse
export function TurnPulse({ color }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{ border: `2px solid ${color}`, boxShadow: `0 0 15px ${color}` }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  )
}

// Win celebration confetti
export function WinConfetti() {
  const pieces = [...Array(30)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#00f5ff', '#ff00ff', '#00ff88', '#fbbf24', '#f97316'][i % 5],
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    size: 6 + Math.random() * 10,
    rotate: Math.random() * 360,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size / 2,
            background: p.color,
            boxShadow: `0 0 8px ${p.color}`,
          }}
          initial={{ y: -20, rotate: p.rotate, opacity: 1 }}
          animate={{ y: '110vh', rotate: p.rotate + 720, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

// Star rating display
export function StarRating({ stars, animated = true }) {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="text-4xl"
          initial={animated ? { scale: 0, rotate: -180 } : {}}
          animate={animated ? { scale: 1, rotate: 0 } : {}}
          transition={animated ? { delay: i * 0.3, type: 'spring', stiffness: 200 } : {}}
          style={{ filter: i <= stars ? 'drop-shadow(0 0 8px #fbbf24)' : 'grayscale(1) opacity(0.3)' }}
        >
          ⭐
        </motion.div>
      ))}
    </div>
  )
}
