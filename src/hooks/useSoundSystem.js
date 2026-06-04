import { useCallback, useRef } from 'react'

// Web Audio API based sound synthesis
function createAudioContext() {
  try {
    return new (window.AudioContext || window.webkitAudioContext)()
  } catch {
    return null
  }
}

function playTone(ctx, freq, type, duration, gain = 0.3, delay = 0) {
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + delay + duration)
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay)
    gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration)
  } catch {}
}

export function useSoundSystem(enabled = true) {
  const ctxRef = useRef(null)

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = createAudioContext()
    }
    if (ctxRef.current?.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  const playLine = useCallback((penStyle = 'standard') => {
    if (!enabled) return
    const ctx = ensureCtx()
    if (!ctx) return
    const freqs = { standard: 440, neon: 880, fire: 220, electric: 660 }
    const types = { standard: 'sine', neon: 'square', fire: 'sawtooth', electric: 'square' }
    playTone(ctx, freqs[penStyle] || 440, types[penStyle] || 'sine', 0.1, 0.15)
  }, [enabled, ensureCtx])

  const playCapture = useCallback(() => {
    if (!enabled) return
    const ctx = ensureCtx()
    if (!ctx) return
    playTone(ctx, 523, 'sine', 0.15, 0.3)
    playTone(ctx, 659, 'sine', 0.15, 0.25, 0.1)
    playTone(ctx, 784, 'sine', 0.2, 0.3, 0.2)
  }, [enabled, ensureCtx])

  const playCombo = useCallback((count) => {
    if (!enabled) return
    const ctx = ensureCtx()
    if (!ctx) return
    const baseFreq = 400 + count * 80
    for (let i = 0; i < Math.min(count, 5); i++) {
      playTone(ctx, baseFreq + i * 120, 'square', 0.12, 0.2, i * 0.08)
    }
  }, [enabled, ensureCtx])

  const playWin = useCallback(() => {
    if (!enabled) return
    const ctx = ensureCtx()
    if (!ctx) return
    const melody = [523, 659, 784, 1047]
    melody.forEach((f, i) => playTone(ctx, f, 'sine', 0.3, 0.3, i * 0.15))
  }, [enabled, ensureCtx])

  const playLose = useCallback(() => {
    if (!enabled) return
    const ctx = ensureCtx()
    if (!ctx) return
    playTone(ctx, 330, 'sawtooth', 0.3, 0.2)
    playTone(ctx, 247, 'sawtooth', 0.4, 0.25, 0.2)
    playTone(ctx, 196, 'sawtooth', 0.5, 0.3, 0.45)
  }, [enabled, ensureCtx])

  const playClick = useCallback(() => {
    if (!enabled) return
    const ctx = ensureCtx()
    if (!ctx) return
    playTone(ctx, 800, 'sine', 0.05, 0.1)
  }, [enabled, ensureCtx])

  const playReaction = useCallback(() => {
    if (!enabled) return
    const ctx = ensureCtx()
    if (!ctx) return
    playTone(ctx, 600, 'sine', 0.08, 0.15)
    playTone(ctx, 800, 'sine', 0.06, 0.1, 0.06)
  }, [enabled, ensureCtx])

  return { playLine, playCapture, playCombo, playWin, playLose, playClick, playReaction }
}
