// Game state utility functions for Dots & Boxes

export function createGameState(size) {
  const hLines = Array(size + 1).fill(null).map(() => Array(size).fill(null))  // null = unclaimed
  const vLines = Array(size).fill(null).map(() => Array(size + 1).fill(null))
  const boxes = Array(size).fill(null).map(() => Array(size).fill(null))       // null | 0 | 1
  return { hLines, vLines, boxes, size }
}

export function cloneGameState(state) {
  return {
    size: state.size,
    hLines: state.hLines.map(r => [...r]),
    vLines: state.vLines.map(r => [...r]),
    boxes: state.boxes.map(r => [...r]),
  }
}

// Check if a line is already drawn
export function isLinePlaced(state, line) {
  const { type, row, col } = line
  if (type === 'h') return state.hLines[row][col] !== null
  return state.vLines[row][col] !== null
}

// Place a line and return newly captured boxes
export function placeLine(state, line, player) {
  const { type, row, col } = line
  const newState = cloneGameState(state)
  if (type === 'h') newState.hLines[row][col] = player
  else newState.vLines[row][col] = player
  const captured = checkCaptures(newState, line, player)
  return { newState, captured }
}

function checkCaptures(state, line, player) {
  const { type, row, col } = line
  const captured = []
  if (type === 'h') {
    if (row > 0 && isBoxComplete(state, row - 1, col)) {
      state.boxes[row - 1][col] = player
      captured.push({ row: row - 1, col })
    }
    if (row < state.size && isBoxComplete(state, row, col)) {
      state.boxes[row][col] = player
      captured.push({ row, col })
    }
  } else {
    if (col > 0 && isBoxComplete(state, row, col - 1)) {
      state.boxes[row][col - 1] = player
      captured.push({ row, col: col - 1 })
    }
    if (col < state.size && isBoxComplete(state, row, col)) {
      state.boxes[row][col] = player
      captured.push({ row, col })
    }
  }
  return captured
}

function isBoxComplete(state, row, col) {
  return (
    state.hLines[row][col] !== null &&
    state.hLines[row + 1][col] !== null &&
    state.vLines[row][col] !== null &&
    state.vLines[row][col + 1] !== null
  )
}

export function countBoxes(state, player) {
  let count = 0
  for (let r = 0; r < state.size; r++)
    for (let c = 0; c < state.size; c++)
      if (state.boxes[r][c] === player) count++
  return count
}

export function isGameOver(state) {
  for (let r = 0; r < state.size; r++)
    for (let c = 0; c < state.size; c++)
      if (state.boxes[r][c] === null) return false
  return true
}

export function getAvailableLines(state) {
  const lines = []
  for (let r = 0; r <= state.size; r++)
    for (let c = 0; c < state.size; c++)
      if (state.hLines[r][c] === null) lines.push({ type: 'h', row: r, col: c })
  for (let r = 0; r < state.size; r++)
    for (let c = 0; c <= state.size; c++)
      if (state.vLines[r][c] === null) lines.push({ type: 'v', row: r, col: c })
  return lines
}

// Count how many sides a box has drawn
function countBoxSides(state, row, col) {
  let count = 0
  if (state.hLines[row][col] !== null) count++
  if (state.hLines[row + 1][col] !== null) count++
  if (state.vLines[row][col] !== null) count++
  if (state.vLines[row][col + 1] !== null) count++
  return count
}

// Get lines that complete a box immediately
function getWinningMoves(state) {
  const available = getAvailableLines(state)
  return available.filter(line => {
    const { newState, captured } = placeLine(state, line, 0)
    return captured.length > 0
  })
}

// Get lines that give the opponent a box
function getDangerousMoves(state) {
  const available = getAvailableLines(state)
  return available.filter(line => {
    const { newState } = placeLine(state, line, 0)
    const opponentWins = getWinningMoves(newState)
    return opponentWins.length > 0
  })
}

// AI decision making
export function getAIMove(state, difficulty) {
  const available = getAvailableLines(state)
  if (available.length === 0) return null

  const winning = getWinningMoves(state)
  const dangerous = getDangerousMoves(state)
  const safe = available.filter(l => !dangerous.find(d => d.type === l.type && d.row === l.row && d.col === l.col))

  if (difficulty === 'beginner') {
    return available[Math.floor(Math.random() * available.length)]
  }

  if (difficulty === 'defensive') {
    if (winning.length > 0) return winning[0]
    if (safe.length > 0) return safe[Math.floor(Math.random() * safe.length)]
    return available[Math.floor(Math.random() * available.length)]
  }

  if (difficulty === 'aggressive') {
    if (winning.length > 0) return winning[0]
    // Pick lines that give opponent 3-sided boxes
    const threeBox = available.filter(line => {
      const { type, row, col } = line
      if (type === 'h') {
        if (row > 0 && countBoxSides(state, row - 1, col) === 2) return true
        if (row < state.size && countBoxSides(state, row, col) === 2) return true
      } else {
        if (col > 0 && countBoxSides(state, row, col - 1) === 2) return true
        if (col < state.size && countBoxSides(state, row, col) === 2) return true
      }
      return false
    })
    if (safe.length > 0) return safe[Math.floor(Math.random() * safe.length)]
    return dangerous[Math.floor(Math.random() * dangerous.length)] || available[0]
  }

  if (difficulty === 'trap') {
    // Full chain-based strategy
    if (winning.length > 0) {
      // Take all winning moves (chains)
      return winning[0]
    }
    // Find boxes with 1 side — build up to chains
    const oneSide = available.filter(line => {
      const { type, row, col } = line
      let sides = 0
      if (type === 'h') {
        if (row > 0) sides = Math.max(sides, countBoxSides(state, row - 1, col))
        if (row < state.size) sides = Math.max(sides, countBoxSides(state, row, col))
      } else {
        if (col > 0) sides = Math.max(sides, countBoxSides(state, row, col - 1))
        if (col < state.size) sides = Math.max(sides, countBoxSides(state, row, col))
      }
      return sides <= 1
    })
    if (oneSide.length > 0) return oneSide[Math.floor(Math.random() * oneSide.length)]
    if (safe.length > 0) return safe[0]
    // Sacrifice smallest chain
    return dangerous[0] || available[0]
  }

  return available[Math.floor(Math.random() * available.length)]
}

// Calculate stars based on performance
export function calculateStars(playerBoxes, totalBoxes, timeSeconds, combos) {
  const captureRate = playerBoxes / totalBoxes
  let stars = 1
  if (captureRate >= 0.5) stars = 2
  if (captureRate >= 0.65 && (timeSeconds < 180 || combos >= 3)) stars = 3
  return stars
}

export function calculateXP(won, stars, boxesCaptured, combos, difficulty) {
  if (!won) return 20
  const diffMultiplier = { beginner: 1, defensive: 1.5, aggressive: 2, trap: 2.5, multiplayer: 1.5 }[difficulty] || 1
  return Math.round((50 + stars * 30 + boxesCaptured * 5 + combos * 10) * diffMultiplier)
}
