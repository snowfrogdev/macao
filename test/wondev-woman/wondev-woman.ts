import { GenerateActions, ApplyAction, StateIsTerminal, CalculateReward } from '../../src/entities'

export interface WondevSquare {
  height: number
  unit: number | undefined
}

export interface Point {
  x: number
  y: number
}
export interface WondevState {
  board: WondevSquare[][]
  player: number
  playerUnitsPos: Point[]
  opponentUnitsPos: Point[]
  playerScore: number
  opponentScore: number
  playerEnded: boolean
  opponentEnded: boolean
}

export interface WondevAction {
  moveFrom: Point
  moveTo: Point
  moveDirection: string
  buildTo: Point
  buildDirection: string
}

interface Map<T> {
  [key: string]: T
}
const WONDEVDIRECTIONS: Map<Point> = {
  N: { x: 0, y: -1 },
  NE: { x: 1, y: -1 },
  E: { x: 1, y: 0 },
  SE: { x: 1, y: 1 },
  S: { x: 0, y: 1 },
  SW: { x: -1, y: 1 },
  W: { x: -1, y: 0 },
  NW: { x: -1, y: -1 }
}

const generateActions: GenerateActions<WondevState, WondevAction> = (
  state: WondevState
): WondevAction[] => {
  let actions: WondevAction[] = []
  const unitsPos = state.player === -1 ? state.playerUnitsPos : state.opponentUnitsPos

  for (const unit of unitsPos) {
    for (const direction in WONDEVDIRECTIONS) {
      const x = unit.x + WONDEVDIRECTIONS[direction].x
      const y = unit.y + WONDEVDIRECTIONS[direction].y
      const unitSquare = state.board[unit.y][unit.x]
      let targetSquare: WondevSquare | undefined
      try {
        targetSquare = state.board[y][x]
      } catch (e) {
        targetSquare = undefined
      }
      // Check if square is accessible from unit position
      if (
        !targetSquare ||
        targetSquare.height > 3 ||
        targetSquare.height < 0 ||
        targetSquare.height - unitSquare.height > 1
      ) {
        continue
      }

      // Check if there is another unit there
      if (targetSquare.unit) continue

      // Check if you can build somewhere around the target
      for (const buildDir in WONDEVDIRECTIONS) {
        const buildX = x + WONDEVDIRECTIONS[buildDir].x
        const buildY = y + WONDEVDIRECTIONS[buildDir].y
        let buildTargetSquare: WondevSquare | undefined
        try {
          buildTargetSquare = state.board[buildY][buildX] || undefined
        } catch (e) {
          buildTargetSquare = undefined
        }

        // Check if square is buildable
        if (!buildTargetSquare || buildTargetSquare.height > 3 || buildTargetSquare.height < 0) {
          continue
        }

        // Check if there is another unit there
        if (buildTargetSquare.unit) continue

        const action: WondevAction = {
          moveFrom: unit,
          moveTo: { x, y },
          buildTo: { x: buildX, y: buildY },
          moveDirection: direction,
          buildDirection: buildDir
        }

        actions.push(action)
      }
    }
  }
  return actions
}

const applyAction: ApplyAction<WondevState, WondevAction> = (
  state: WondevState,
  action: WondevAction
): WondevState => {
  const stringifiedState = JSON.stringify(state)
  const newState = JSON.parse(stringifiedState) as WondevState
  // If there are no possible actions, the player has lost, update score accordingly
  if (!action) {
    newState.player *= -1
    if (newState.player === 1) {
      newState.playerEnded = true
      return newState
    }
    newState.opponentEnded = true
    return newState
  }

  // Move the unit
  if (state.player === -1) {
    newState.board[action.moveFrom.y][action.moveFrom.x].unit = 0
    newState.board[action.moveTo.y][action.moveTo.x].unit = 1
    // If unit moves into a level 3 square, update score
    if (newState.board[action.moveTo.y][action.moveTo.x].height === 3) newState.playerScore++
    // Update unit position
    for (const playerUnit of newState.playerUnitsPos) {
      if (playerUnit.x === action.moveFrom.x && playerUnit.y === action.moveFrom.y) {
        playerUnit.x = action.moveTo.x
        playerUnit.y = action.moveTo.y
      }
    }
  }

  if (state.player === 1) {
    newState.board[action.moveFrom.y][action.moveFrom.x].unit = 0
    newState.board[action.moveTo.y][action.moveTo.x].unit = -1
    // If unit moves into a level 3 square, update score
    if (newState.board[action.moveTo.y][action.moveTo.x].height === 3) newState.opponentScore++
    // Update unit position
    for (const opponentUnit of newState.opponentUnitsPos) {
      if (opponentUnit.x === action.moveFrom.x && opponentUnit.y === action.moveFrom.y) {
        opponentUnit.x = action.moveTo.x
        opponentUnit.y = action.moveTo.y
      }
    }
  }

  // Build
  newState.board[action.buildTo.y][action.buildTo.x].height++

  newState.player *= -1

  return newState
}

const stateIsTerminal: StateIsTerminal<WondevState> = (state: WondevState) => {
  if (state.playerEnded && state.opponentEnded) return true

  return false
}

const calculateReward: CalculateReward<WondevState> = (state: WondevState, player: number) => {
  if (player === 1) {
    if (state.playerScore > state.opponentScore) return 1
    if (state.playerScore < state.opponentScore) return -1
  }
  if (player === -1) {
    if (state.opponentScore > state.playerScore) return 1
    if (state.opponentScore < state.playerScore) return -1
  }
  return 0
}

export const wondevFuncs = {
  generateActions,
  applyAction,
  stateIsTerminal,
  calculateReward
}
