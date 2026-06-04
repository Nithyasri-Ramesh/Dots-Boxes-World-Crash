import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AVATARS } from '../../data/gameData'

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🧑‍🚀')

  const steps = [
    {
      title: 'WELCOME TO',
      subtitle: 'DOTS & BOXES\nWORLD CLASH',
      desc: 'The ultimate cinematic Dots & Boxes experience. Conquer themed worlds, defeat AI opponents, and become the champion!',
      action: 'LET\'S GO →',
    },
    {
      title: 'CHOOSE YOUR',
      subtitle: 'IDENTITY',
      desc: 'Pick a name and avatar to represent you across all worlds.',
      action: 'START YOUR JOURNEY →',
    },
  ]

  function handleAction() {
    if (step === 0) { setStep(1); return }
    onComplete({ name: name || 'Player 1', avatar })
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #050510 0%, #0a0520 50%, #050510 100%)' }}>

      {/* Animated grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Floating dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed rounded-full"
          style={{
            width: 8 + i * 4,
            height: 8 + i * 4,
            background: i % 2 === 0 ? '#00f5ff' : '#ff00ff',
            boxShadow: `0 0 20px ${i % 2 === 0 ? '#00f5ff' : '#ff00ff'}`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ duration: 3 + i * 0.5, delay: i * 0.4, repeat: Infinity }}
        />
      ))}

      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center gap-8">
        <motion.div
          key={step}
          className="text-center flex flex-col gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-display text-sm tracking-widest text-gray-400">{steps[step].title}</div>
          <h1 className="font-display font-black text-3xl leading-tight whitespace-pre-line shimmer-text">
            {steps[step].subtitle}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed">{steps[step].desc}</p>
        </motion.div>

        {step === 1 && (
          <motion.div
            className="w-full flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Avatar preview */}
            <div className="flex justify-center">
              <motion.div
                className="w-20 h-20 glass rounded-full flex items-center justify-center text-4xl"
                style={{ border: '2px solid #00f5ff', boxShadow: '0 0 25px #00f5ff44' }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {avatar}
              </motion.div>
            </div>

            {/* Name */}
            <input
              className="w-full glass rounded-xl px-4 py-3 font-display text-sm outline-none text-white text-center"
              style={{ borderColor: '#00f5ff60', borderWidth: 1, borderStyle: 'solid', background: 'transparent' }}
              placeholder="Enter your name..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={16}
              autoFocus
            />

            {/* Avatars */}
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map(a => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className="glass rounded-xl p-2 text-2xl text-center transition-all duration-200"
                  style={{
                    borderColor: avatar === a ? '#00f5ff' : 'rgba(255,255,255,0.07)',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    transform: avatar === a ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          className="btn-glow-blue w-full py-4 text-sm"
          onClick={handleAction}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {steps[step].action}
        </motion.button>

        {/* Step dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: i === step ? '#00f5ff' : 'rgba(255,255,255,0.2)', boxShadow: i === step ? '0 0 8px #00f5ff' : 'none' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
