import { Macao } from '../../src/macao'

export interface UTicTacToeMove {
  bigRow: number
  bigCol: number
  smallRow: number
  smallCol: number
}

export interface UTicTacToeState {
  board: number[][][][]
  player: number
  previousAction: UTicTacToeMove
}

export interface TicTacToeState {
  board: (number | string)[][]
}

export function convertToMove(row: number, col: number): UTicTacToeMove {
  const bigRow = Math.floor(row / 3)
  const bigCol = Math.floor(col / 3)
  const smallRow = Math.floor(row % 3)
  const smallCol = Math.floor(col % 3)
  return { bigRow, bigCol, smallRow, smallCol }
}

export function convertFromMove(move: UTicTacToeMove): { row: number; col: number } {
  const row = Math.floor(move.bigRow * 3) + Math.floor(move.smallRow % 3)
  const col = Math.floor(move.bigCol * 3) + Math.floor(move.smallCol % 3)
  return { row, col }
}

export const uTicTacToeBoard = [
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ],
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ],
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ]
]

export function possibleMovesUTicTacToe(state: UTicTacToeState): UTicTacToeMove[] {
  const result: UTicTacToeMove[] = []
  if (state.previousAction.bigRow !== -1) {
    const bigRow = state.previousAction.smallRow
    const bigCol = state.previousAction.smallCol
    const innerState = { board: state.board[bigRow][bigCol] }

    // Check if the inner board square the previous player played into is not terminal
    if (!stateIsTerminalTicTacToe(innerState)) {
      // Only check for moves in the big board square
      innerState.board.forEach((smallRowArray, smallRow) => {
        smallRowArray.forEach((value, smallCol) => {
          if (value === 0) result.push({ bigRow, bigCol, smallRow, smallCol })
        })
      })
      return result
    }
  }

  // If that inner board is Terminal, we have to check all other inner boards
  state.board.forEach((bigRowArray, bigRow) => {
    bigRowArray.forEach((innerSquare, bigCol) => {
      const innerState = { board: innerSquare }
      // Check if inner board is not Terminal
      if (!stateIsTerminalTicTacToe(innerState)) {
        // Push all possible moves to result array
        innerState.board.forEach((smallRowArray, smallRow) => {
          smallRowArray.forEach((value, smallCol) => {
            if (value === 0) {
              result.push({ bigRow, bigCol, smallRow, smallCol })
            }
          })
        })
      }
    })
  })
  return result
}

// Be careful not to mutate the board but to return a new one
export function playMoveUTicTacToe(state: UTicTacToeState, move: UTicTacToeMove): UTicTacToeState {
  const jSONBoard = JSON.stringify(state.board)
  const newBoard = JSON.parse(jSONBoard)

  newBoard[move.bigRow][move.bigCol][move.smallRow][move.smallCol] = state.player * -1
  const newState: UTicTacToeState = {
    board: newBoard,
    player: state.player * -1,
    previousAction: move
  }
  return newState
}

export function stateIsTerminalTicTacToe(state: TicTacToeState): boolean {
  for (let i = 0; i < 3; i++) {
    // check rows to see if there is a winner
    if (
      state.board[i][0] === state.board[i][1] &&
      state.board[i][1] === state.board[i][2] &&
      state.board[i][0] !== 0 &&
      state.board[i][0] !== 'D'
    ) {
      return true
    }

    // check cols to see if there is a winner
    if (
      state.board[0][i] === state.board[1][i] &&
      state.board[1][i] === state.board[2][i] &&
      state.board[0][i] !== 0 &&
      state.board[0][i] !== 'D'
    ) {
      return true
    }
  }

  // check diags to see if there is a winner
  if (
    state.board[0][0] === state.board[1][1] &&
    state.board[1][1] === state.board[2][2] &&
    state.board[0][0] !== 0 &&
    state.board[0][0] !== 'D'
  ) {
    return true
  }

  if (
    state.board[0][2] === state.board[1][1] &&
    state.board[1][1] === state.board[2][0] &&
    state.board[0][2] !== 0 &&
    state.board[0][2] !== 'D'
  ) {
    return true
  }

  // check to see if the board is full and therefore a draw
  const flattenBoard = state.board.reduce((p, c) => p.concat(c))
  if (flattenBoard.every(value => value !== 0)) return true

  return false
}

export function stateIsTerminalUTicTacToe(state: UTicTacToeState): boolean {
  let metaboard: (number | string)[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

  state.board.forEach((bigRow, bigRowIndex) => {
    bigRow.forEach((innerBoard, bigColIndex) => {
      const innerState = { board: innerBoard }
      if (stateIsTerminalTicTacToe(innerState)) {
        const score = calculateRewardTicTacToe(innerState, 1)
        metaboard[bigRowIndex][bigColIndex] = score === 0 ? 'D' : score
      }
    })
  })

  return stateIsTerminalTicTacToe({ board: metaboard })
}

export function calculateRewardTicTacToe(state: TicTacToeState, player: number): number {
  for (let i = 0; i < 3; i++) {
    // check rows to see if there is a winner
    if (
      state.board[i][0] === state.board[i][1] &&
      state.board[i][1] === state.board[i][2] &&
      state.board[i][0] !== 0
    ) {
      if (state.board[i][0] === player) return 1

      return -1
    }

    // check cols to see if there is a winner
    if (
      state.board[0][i] === state.board[1][i] &&
      state.board[1][i] === state.board[2][i] &&
      state.board[0][i] !== 0
    ) {
      if (state.board[0][i] === player) return 1

      return -1
    }
  }

  // check diags to see if there is a winner
  if (
    state.board[0][0] === state.board[1][1] &&
    state.board[1][1] === state.board[2][2] &&
    state.board[0][0] !== 0
  ) {
    if (state.board[0][0] === player) return 1

    return -1
  }

  if (
    state.board[0][2] === state.board[1][1] &&
    state.board[1][1] === state.board[2][0] &&
    state.board[0][2] !== 0
  ) {
    if (state.board[0][2] === player) return 1

    return -1
  }

  return 0
}

export function calculateRewardUTicTacToe(state: UTicTacToeState, player: number): number {
  for (let i = 0; i < 3; i++) {
    // check rows to see if there is a winner
    if (
      calculateRewardTicTacToe({ board: state.board[i][0] }, player) ===
        calculateRewardTicTacToe({ board: state.board[i][1] }, player) &&
      calculateRewardTicTacToe({ board: state.board[i][1] }, player) ===
        calculateRewardTicTacToe({ board: state.board[i][2] }, player)
    ) {
      if (calculateRewardTicTacToe({ board: state.board[i][0] }, player) === 1) return 1

      return -1
    }

    // check cols to see if there is a winner
    if (
      calculateRewardTicTacToe({ board: state.board[0][i] }, player) ===
        calculateRewardTicTacToe({ board: state.board[1][i] }, player) &&
      calculateRewardTicTacToe({ board: state.board[1][i] }, player) ===
        calculateRewardTicTacToe({ board: state.board[2][i] }, player)
    ) {
      if (calculateRewardTicTacToe({ board: state.board[0][i] }, player) === 1) return 1

      return -1
    }
  }

  // check diags to see if there is a winner
  if (
    calculateRewardTicTacToe({ board: state.board[0][0] }, player) ===
      calculateRewardTicTacToe({ board: state.board[1][1] }, player) &&
    calculateRewardTicTacToe({ board: state.board[1][1] }, player) ===
      calculateRewardTicTacToe({ board: state.board[2][2] }, player)
  ) {
    if (calculateRewardTicTacToe({ board: state.board[0][0] }, player) === 1) return 1

    return -1
  }

  if (
    calculateRewardTicTacToe({ board: state.board[0][2] }, player) ===
      calculateRewardTicTacToe({ board: state.board[1][1] }, player) &&
    calculateRewardTicTacToe({ board: state.board[1][1] }, player) ===
      calculateRewardTicTacToe({ board: state.board[2][0] }, player)
  ) {
    if (calculateRewardTicTacToe({ board: state.board[0][2] }, player) === 1) return 1

    return -1
  }

  // If there is no 3 in a row, the winner is whoever has won the most small boards
  let player1 = 0
  let player2 = 0

  for (const row of state.board) {
    for (const col of row) {
      const result = calculateRewardTicTacToe({ board: col }, player)
      switch (result) {
        case 1:
          player1++
          break
        case -1:
          player2++
          break
      }
    }
  }

  if (player1 > player2) return 1
  if (player2 > player1) return -1

  return 0
}

export const uTicTacToeFuncs = {
  generateActions: possibleMovesUTicTacToe,
  applyAction: playMoveUTicTacToe,
  stateIsTerminal: stateIsTerminalUTicTacToe,
  calculateReward: calculateRewardUTicTacToe
}

const testBoard = [
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ],
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [-1, 1, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ],
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ]
]
const testState = {
  board: testBoard,
  player: -1,
  previousAction: {
    bigRow: 1,
    bigCol: 1,
    smallRow: 1,
    smallCol: 0
  }
}

// const mcts = new Macao(ticTacToeFuncs, {duration: 2000});
// mcts.getAction(testState); //?

// possibleMovesUTicTacToe(testState) //?
// stateIsTerminalUTicTacToe(testState) //?
// calculateRewardUTicTacToe(testState, 1)
// playMoveUTicTacToe(testState, {bigRow:0, bigCol:0, smallCol:0, smallRow:0}).board[0][0]
