import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameBoard from './GameBoard'
import GameHUD from './GameHUD'
import { ComboEffect, EmojiReaction, ScreenFlash, WinConfetti } from '../effects/GameEffects'
import { WorldBackground } from '../effects/WorldBackground'
import { THEMES } from '../../data/gameData'
import {
  createGameState, placeLine, isLinePlaced, countBoxes,
  isGameOver, getAIMove, calculateStars, calculateXP
} from '../../utils/gameLogic'

const AI_DELAY = { beginner: 900, defensive: 700, aggressive: 500, trap: 600 }

export default function GameScreen({
  gameMode,
  aiDifficulty,
  gridSize,
  theme,
  pen,
  playerNames,
  playerAvatars,
  onGameEnd,
  onPause,
  saveData,
}) {
  const [gameState, setGameState] = useState(() => createGameState(gridSize))
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [scores, setScores] = useState([0, 0])
  const [combo, setCombo] = useState(0)
  const [lastCapturer, setLastCapturer] = useState(null)
  const [highlightedBoxes, setHighlightedBoxes] = useState([])
  const [lastLine, setLastLine] = useState(null)
  const [reactions, setReactions] = useState([])
  const [flashColor, setFlashColor] = useState(null)
  const [showCombo, setShowCombo] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const timerRef = useRef(null)
  const aiTimerRef = useRef(null)
  const totalBoxes = gridSize * gridSize
  const themeData = THEMES[theme] || THEMES.neon

  // Timer
  useEffect(() => {
    if (!isPaused && !gameOver) {
      timerRef.current = setInterval(() => setTimeElapsed(t => t + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isPaused, gameOver])

  const handleGameOver = useCallback((finalScores, finalState) => {
    setGameOver(true)
    clearInterval(timerRef.current)
    const won = finalScores[0] > finalScores[1]
    const lost = finalScores[0] < finalScores[1]
    const draw = finalScores[0] === finalScores[1]
    const stars = won ? calculateStars(finalScores[0], totalBoxes, timeElapsed, combo) : (draw ? 1 : 0)
    const xp = calculateXP(won, stars, finalScores[0], combo, aiDifficulty || 'multiplayer')
    setTimeout(() => {
      onGameEnd({
        won, lost, draw, scores: finalScores,
        stars, xp, timeElapsed, bestCombo: combo,
        boxesCaptured: finalScores[0],
        totalBoxes,
      })
    }, 1200)
  }, [timeElapsed, combo, totalBoxes, aiDifficulty, onGameEnd])

  const processMove = useCallback((state, line, player) => {
    if (isLinePlaced(state, line)) return

    const { newState, captured } = placeLine(state, line, player)
    setLastLine(line)
    setGameState(newState)

    const newScores = [countBoxes(newState, 0), countBoxes(newState, 1)]
    setScores(newScores)

    if (captured.length > 0) {
      setHighlightedBoxes(captured)
      setTimeout(() => setHighlightedBoxes([]), 600)

      const newCombo = lastCapturer === player ? combo + captured.length : captured.length
      setCombo(newCombo)
      setLastCapturer(player)
      setShowCombo(true)
      setTimeout(() => setShowCombo(false), 1400)

      const captureColor = player === 0 ? themeData.colors.lineP1 : themeData.colors.lineP2
      setFlashColor(captureColor + '22')
      setTimeout(() => setFlashColor(null), 300)

      if (isGameOver(newState)) {
        handleGameOver(newScores, newState)
        return
      }
      // Player keeps turn after capture — schedule AI if needed
      if (gameMode === 'ai' && player === 0) return // human keeps turn
      if (gameMode === 'ai' && player === 1) {
        scheduleAI(newState, newScores)
      }
      return
    }

    // No capture: switch player
    setCombo(0)
    setLastCapturer(null)
    const next = player === 0 ? 1 : 0
    setCurrentPlayer(next)

    if (isGameOver(newState)) {
      handleGameOver(newScores, newState)
      return
    }

    if (gameMode === 'ai' && next === 1) {
      scheduleAI(newState, newScores)
    }
  }, [combo, lastCapturer, themeData, gameMode, handleGameOver])

  const scheduleAI = useCallback((state, currentScores) => {
    setAiThinking(true)
    const delay = AI_DELAY[aiDifficulty] || 700

    // Recursive AI turn runner — keeps going while AI captures boxes
    function runAITurn(currentState, scores) {
      aiTimerRef.current = setTimeout(() => {
        const move = getAIMove(currentState, aiDifficulty)
        if (!move) {
          setAiThinking(false)
          setCurrentPlayer(0)
          return
        }

        const { newState, captured } = placeLine(currentState, move, 1)
        setLastLine(move)
        setGameState(newState)

        const newScores = [countBoxes(newState, 0), countBoxes(newState, 1)]
        setScores(newScores)

        if (captured.length > 0) {
          setHighlightedBoxes(captured)
          setTimeout(() => setHighlightedBoxes([]), 600)
          setFlashColor(themeData.colors.lineP2 + '22')
          setTimeout(() => setFlashColor(null), 300)

          if (isGameOver(newState)) {
            setAiThinking(false)
            handleGameOver(newScores, newState)
            return
          }
          // AI captured — keep its turn but add a small delay
          runAITurn(newState, newScores)
          return
        }

        // No capture — hand back to player
        setAiThinking(false)
        setCurrentPlayer(0)

        if (isGameOver(newState)) {
          handleGameOver(newScores, newState)
        }
      }, delay)
    }

    runAITurn(state, currentScores)
  }, [aiDifficulty, themeData, handleGameOver])

  useEffect(() => {
    return () => {
      clearTimeout(aiTimerRef.current)
      clearInterval(timerRef.current)
    }
  }, [])

  const handleLinePlaced = useCallback((line) => {
    if (isPaused || gameOver || aiThinking) return
    if (gameMode === 'ai' && currentPlayer === 1) return
    processMove(gameState, line, currentPlayer)
  }, [isPaused, gameOver, aiThinking, gameMode, currentPlayer, gameState, processMove])

  const handleReaction = useCallback((emoji) => {
    const id = Date.now()
    setReactions(prev => [...prev, { emoji, id }])
  }, [])

  const handleRemoveReaction = useCallback((id) => {
    setReactions(prev => prev.filter(r => r.id !== id))
  }, [])

  const handlePause = useCallback(() => {
    if (gameOver) return
    setIsPaused(p => !p)
    if (!isPaused) onPause?.()
  }, [gameOver, isPaused, onPause])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between gap-3 px-3 py-3 min-h-screen"
      style={{ background: themeData.colors.bgGradient }}>
      <WorldBackground themeId={theme} />

      {flashColor && <ScreenFlash color={flashColor} />}

      {/* Floating reactions */}
      <AnimatePresence>
        {reactions.map(r => (
          <EmojiReaction key={r.id} emoji={r.emoji} id={r.id} onDone={() => handleRemoveReaction(r.id)} />
        ))}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center gap-3">
        <GameHUD
          scores={scores}
          currentPlayer={currentPlayer}
          playerNames={playerNames}
          playerAvatars={playerAvatars}
          theme={theme}
          combo={combo}
          timeElapsed={timeElapsed}
          totalBoxes={totalBoxes}
          isPaused={isPaused}
          onPause={handlePause}
          onReaction={handleReaction}
          gameMode={gameMode}
        />

        {/* Board container */}
        <div className="relative glass rounded-2xl p-3 md:p-4 flex items-center justify-center"
          style={{
            borderColor: `${themeData.colors.primary}33`,
            boxShadow: `0 0 30px ${themeData.colors.primary}11, inset 0 0 30px ${themeData.colors.primary}05`,
          }}>
          {/* Combo overlay */}
          <AnimatePresence>
            {showCombo && combo >= 2 && (
              <ComboEffect combo={combo} theme={themeData} />
            )}
          </AnimatePresence>

          <GameBoard
            gameState={gameState}
            onLinePlaced={handleLinePlaced}
            currentPlayer={currentPlayer}
            disabled={isPaused || gameOver || (gameMode === 'ai' && currentPlayer === 1) || aiThinking}
            theme={theme}
            pen={pen}
            highlightedBoxes={highlightedBoxes}
            lastLine={lastLine}
          />
        </div>

        {/* AI thinking indicator */}
        <AnimatePresence>
          {aiThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display text-sm text-center"
              style={{ color: themeData.colors.secondary }}
            >
              🤖 AI is thinking...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              className="absolute inset-0 glass-dark rounded-2xl flex flex-col items-center justify-center gap-6 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="font-display text-3xl font-bold neon-text-blue">PAUSED</div>
              <button onClick={handlePause} className="btn-glow-blue text-sm">
                ▶ RESUME
              </button>
              <button onClick={() => onGameEnd(null)} className="btn-glow-pink text-sm">
                🏠 QUIT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
