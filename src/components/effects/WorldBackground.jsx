import React, { useMemo, memo } from 'react'

// All particle data is memoized at module level — computed once, never re-created
const CYBER_GLITCHES = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  left: 10 + i * 22,
  top: 15 + i * 18,
  width: 40 + i * 20,
  color: i % 2 === 0 ? '#00f5ff' : '#ff00ff',
  duration: 2 + i * 0.5,
  delay: i * 0.3,
}))

const SNOWFLAKES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: (i * 4.1) % 100,
  delay: (i * 0.35) % 8,
  duration: 7 + (i % 5),
  size: 3 + (i % 4),
  drift: ((i % 7) - 3) * 15,
}))

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: 5 + (i * 5.3) % 90,
  delay: (i * 0.25) % 4,
  duration: 2.5 + (i % 3),
  size: 3 + (i % 6),
  drift: ((i % 7) - 3) * 20,
  color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#f97316' : '#ef4444',
}))

const LAVA_BUBBLES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  left: 10 + i * 14,
  bottom: 5 + (i % 3) * 6,
  size: 10 + (i % 3) * 6,
  duration: 3.5 + (i % 3),
  delay: i * 0.6,
}))

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: (i * 2.1) % 100,
  top: (i * 1.97) % 100,
  size: 0.8 + (i % 3) * 0.7,
  delay: (i * 0.11) % 5,
  duration: 2.5 + (i % 4),
}))

const BIG_STARS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: (i * 11.3) % 100,
  top: (i * 9.7) % 100,
  size: 2 + (i % 3),
  delay: (i * 0.4) % 3,
}))

export const CyberBackground = memo(function CyberBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'auto' }}>
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-cyan-500/20" />
      <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-cyan-500/20" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-cyan-500/20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-cyan-500/20" />
      {CYBER_GLITCHES.map(g => (
        <div key={g.id} className="absolute opacity-10" style={{
          left: `${g.left}%`, top: `${g.top}%`,
          width: `${g.width}px`, height: '2px',
          background: g.color,
          animation: `glitch ${g.duration}s ${g.delay}s infinite`,
          willChange: 'transform',
        }} />
      ))}
    </div>
  )
})

export const IceBackground = memo(function IceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(125,211,252,0.07) 0%, transparent 60%)',
      }} />
      <div className="absolute inset-0 opacity-4" style={{
        backgroundImage: `radial-gradient(circle, rgba(186,230,253,0.6) 1px, transparent 1px)`,
        backgroundSize: '35px 35px',
      }} />
      {SNOWFLAKES.map(s => (
        <div key={s.id} className="absolute rounded-full bg-blue-100" style={{
          left: `${s.left}%`, top: '-8px',
          width: `${s.size}px`, height: `${s.size}px`,
          opacity: 0.65,
          animation: `snowfall ${s.duration}s ${s.delay}s linear infinite`,
          '--drift': `${s.drift}px`,
          willChange: 'transform',
        }} />
      ))}
      <div className="absolute top-0 inset-x-0 h-48 opacity-15" style={{
        background: 'linear-gradient(180deg, rgba(125,211,252,0.4) 0%, transparent 100%)',
        filter: 'blur(15px)',
      }} />
    </div>
  )
})

export const LavaBackground = memo(function LavaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute bottom-0 inset-x-0 h-64 opacity-25" style={{
        background: 'linear-gradient(0deg, rgba(249,115,22,0.5) 0%, rgba(239,68,68,0.2) 40%, transparent 100%)',
        filter: 'blur(15px)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.1) 0%, transparent 65%)',
      }} />
      {LAVA_BUBBLES.map(b => (
        <div key={b.id} className="absolute rounded-full" style={{
          bottom: `${b.bottom}%`, left: `${b.left}%`,
          width: `${b.size}px`, height: `${b.size}px`,
          background: 'radial-gradient(circle, #f97316, #ef4444)',
          opacity: 0.35,
          animation: `bubbleRise ${b.duration}s ${b.delay}s ease-out infinite`,
          filter: 'blur(1px)',
          willChange: 'transform, opacity',
        }} />
      ))}
      {EMBERS.map(e => (
        <div key={e.id} className="absolute rounded-full" style={{
          left: `${e.left}%`, bottom: '0',
          width: `${e.size}px`, height: `${e.size}px`,
          background: e.color,
          animation: `ember ${e.duration}s ${e.delay}s ease-out infinite`,
          '--drift': `${e.drift}px`,
          willChange: 'transform, opacity',
        }} />
      ))}
    </div>
  )
})

export const SpaceBackground = memo(function SpaceBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 40%),
          radial-gradient(ellipse at 60% 80%, rgba(236,72,153,0.06) 0%, transparent 40%)
        `,
      }} />
      {STARS.map(s => (
        <div key={s.id} className="absolute bg-white rounded-full" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          opacity: 0.55,
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          willChange: 'opacity, transform',
        }} />
      ))}
      {BIG_STARS.map(s => (
        <div key={`b${s.id}`} className="absolute rounded-full" style={{
          left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          background: 'white',
          boxShadow: `0 0 ${s.size * 3}px ${s.size}px rgba(168,85,247,0.5)`,
          animation: `twinkle ${3 + s.delay}s ${s.delay}s ease-in-out infinite`,
          willChange: 'opacity, transform',
        }} />
      ))}
    </div>
  )
})

export const WorldBackground = memo(function WorldBackground({ themeId }) {
  switch (themeId) {
    case 'ice':   return <IceBackground />
    case 'lava':  return <LavaBackground />
    case 'space': return <SpaceBackground />
    default:      return <CyberBackground />
  }
})
