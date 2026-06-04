import React, { useState, useCallback, useRef, useEffect, memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { THEMES, PENS } from '../../data/gameData'

function getLineKey(line) {
  return `${line.type}-${line.row}-${line.col}`
}

const GameBoard = memo(function GameBoard({
  gameState, onLinePlaced, currentPlayer, disabled,
  theme, pen, highlightedBoxes, lastLine,
}) {
  const [hoveredLine, setHoveredLine] = useState(null)
  const themeData = THEMES[theme] || THEMES.neon
  const penData   = PENS[pen]  || PENS.standard

  const p1Color      = themeData.colors.lineP1
  const p2Color      = themeData.colors.lineP2
  const dotColor     = themeData.colors.dot
  const currentColor = currentPlayer === 0 ? p1Color : p2Color
  const glowIntensity = penData.glowIntensity || 1

  const size = gameState.size

  // Compute board dimensions once
  const cellSize = useMemo(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth  : 500
    const vh = typeof window !== 'undefined' ? window.innerHeight : 700
    return Math.min(Math.floor(Math.min(vw * 0.82, vh * 0.52, 460) / (size + 0.5)), 88)
  }, [size])

  const dotR       = Math.max(5, cellSize * 0.09)
  const lineW      = Math.max(4, cellSize * 0.08)
  const pad        = dotR
  const boardW     = cellSize * size + dotR * 2
  const boardH     = cellSize * size + dotR * 2

  const dotX = (col) => pad + col * cellSize
  const dotY = (row) => pad + row * cellSize

  // Handlers — stable references
  const handleEnter = useCallback((key) => { if (!disabled) setHoveredLine(key) }, [disabled])
  const handleLeave = useCallback(() => setHoveredLine(null), [])
  const handleClick = useCallback((line) => {
    const val = line.type === 'h'
      ? gameState.hLines[line.row][line.col]
      : gameState.vLines[line.row][line.col]
    if (val !== null || disabled) return
    onLinePlaced(line)
  }, [gameState, disabled, onLinePlaced])

  // Build line color lookup
  const getLineColor = useCallback((type, row, col) => {
    const val = type === 'h' ? gameState.hLines[row][col] : gameState.vLines[row][col]
    if (val === null) return null
    return val === 0 ? p1Color : p2Color
  }, [gameState, p1Color, p2Color])

  const isLast = useCallback((type, row, col) =>
    lastLine && lastLine.type === type && lastLine.row === row && lastLine.col === col,
  [lastLine])

  // Pre-compute dots array
  const dots = useMemo(() => {
    const arr = []
    for (let r = 0; r <= size; r++)
      for (let c = 0; c <= size; c++)
        arr.push({ r, c, key: `d-${r}-${c}` })
    return arr
  }, [size])

  return (
    <svg width={boardW} height={boardH}
      className="select-none touch-none"
      style={{ overflow: 'visible' }}>

      {/* Box fills */}
      {gameState.boxes.map((row, r) =>
        row.map((owner, c) => {
          if (owner === null) return null
          const fc = owner === 0 ? themeData.colors.boxP1 : themeData.colors.boxP2
          const sc = owner === 0 ? p1Color : p2Color
          return (
            <motion.rect key={`bx-${r}-${c}`}
              x={dotX(c)+2} y={dotY(r)+2}
              width={cellSize-4} height={cellSize-4}
              fill={fc} stroke={sc} strokeWidth={1} strokeOpacity={0.35}
              initial={{ opacity:0, scale:0.5 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.25, type:'spring', stiffness:320 }}
              style={{ transformOrigin:`${dotX(c)+cellSize/2}px ${dotY(r)+cellSize/2}px` }}
            />
          )
        })
      )}

      {/* Horizontal lines */}
      {gameState.hLines.map((row, r) =>
        row.map((val, c) => {
          const key  = `h-${r}-${c}`
          const pc   = getLineColor('h', r, c)
          const hovd = hoveredLine === key
          const last = isLast('h', r, c)
          const x1 = dotX(c), y1 = dotY(r), x2 = dotX(c+1), y2 = dotY(r)

          return (
            <g key={key}>
              {/* Wide invisible hit zone */}
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="transparent" strokeWidth={cellSize*0.38}
                className={!disabled && !pc ? 'cursor-pointer' : ''}
                onMouseEnter={() => handleEnter(key)}
                onMouseLeave={handleLeave}
                onClick={() => handleClick({ type:'h', row:r, col:c })}
                onTouchStart={e => { e.preventDefault(); handleClick({ type:'h', row:r, col:c }) }}
              />
              {/* Ghost line */}
              {!pc && (
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={dotColor} strokeWidth={hovd ? lineW : 1.5}
                  strokeLinecap="round" strokeDasharray={hovd ? 'none' : '4 4'}
                  opacity={hovd ? 0.5 : 0.12}
                  style={hovd ? { filter:`drop-shadow(0 0 4px ${currentColor})` } : {}}
                />
              )}
              {/* Placed line */}
              {pc && (
                <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={pc} strokeWidth={lineW} strokeLinecap="round"
                  initial={{ pathLength:0, opacity:0 }}
                  animate={{ pathLength:1, opacity:1 }}
                  transition={{ duration:0.2 }}
                  style={{ filter:`drop-shadow(0 0 ${3*glowIntensity}px ${pc})` }}
                />
              )}
              {/* Flash on last placed */}
              {last && pc && (
                <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={pc} strokeWidth={lineW*1.8} strokeLinecap="round"
                  initial={{ opacity:0.7 }} animate={{ opacity:0 }}
                  transition={{ duration:0.4 }}
                  style={{ filter:`drop-shadow(0 0 10px ${pc})` }}
                />
              )}
            </g>
          )
        })
      )}

      {/* Vertical lines */}
      {gameState.vLines.map((row, r) =>
        row.map((val, c) => {
          const key  = `v-${r}-${c}`
          const pc   = getLineColor('v', r, c)
          const hovd = hoveredLine === key
          const last = isLast('v', r, c)
          const x1 = dotX(c), y1 = dotY(r), x2 = dotX(c), y2 = dotY(r+1)

          return (
            <g key={key}>
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="transparent" strokeWidth={cellSize*0.38}
                className={!disabled && !pc ? 'cursor-pointer' : ''}
                onMouseEnter={() => handleEnter(key)}
                onMouseLeave={handleLeave}
                onClick={() => handleClick({ type:'v', row:r, col:c })}
                onTouchStart={e => { e.preventDefault(); handleClick({ type:'v', row:r, col:c }) }}
              />
              {!pc && (
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={dotColor} strokeWidth={hovd ? lineW : 1.5}
                  strokeLinecap="round" strokeDasharray={hovd ? 'none' : '4 4'}
                  opacity={hovd ? 0.5 : 0.12}
                  style={hovd ? { filter:`drop-shadow(0 0 4px ${currentColor})` } : {}}
                />
              )}
              {pc && (
                <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={pc} strokeWidth={lineW} strokeLinecap="round"
                  initial={{ pathLength:0, opacity:0 }}
                  animate={{ pathLength:1, opacity:1 }}
                  transition={{ duration:0.2 }}
                  style={{ filter:`drop-shadow(0 0 ${3*glowIntensity}px ${pc})` }}
                />
              )}
              {last && pc && (
                <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={pc} strokeWidth={lineW*1.8} strokeLinecap="round"
                  initial={{ opacity:0.7 }} animate={{ opacity:0 }}
                  transition={{ duration:0.4 }}
                  style={{ filter:`drop-shadow(0 0 10px ${pc})` }}
                />
              )}
            </g>
          )
        })
      )}

      {/* Box owner labels */}
      {gameState.boxes.map((row, r) =>
        row.map((owner, c) => {
          if (owner === null) return null
          const color = owner === 0 ? p1Color : p2Color
          return (
            <motion.text key={`lbl-${r}-${c}`}
              x={dotX(c)+cellSize/2} y={dotY(r)+cellSize/2+1}
              textAnchor="middle" dominantBaseline="middle"
              fill={color} fontSize={Math.max(9, cellSize*0.2)}
              fontFamily="Orbitron,sans-serif" fontWeight="bold" opacity={0.8}
              initial={{ opacity:0, scale:0 }} animate={{ opacity:0.8, scale:1 }}
              transition={{ delay:0.12 }}
              style={{ filter:`drop-shadow(0 0 3px ${color})` }}>
              P{owner+1}
            </motion.text>
          )
        })
      )}

      {/* Dots — rendered last so they sit on top */}
      {dots.map(({ r, c, key }) => (
        <circle key={key}
          cx={dotX(c)} cy={dotY(r)} r={dotR}
          fill={dotColor}
          style={{ filter:`drop-shadow(0 0 ${dotR*1.2}px ${dotColor})` }}
        />
      ))}
    </svg>
  )
})

export default GameBoard
