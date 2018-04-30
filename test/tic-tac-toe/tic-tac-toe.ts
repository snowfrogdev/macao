export interface TicTacToeMove {
  row: number
  col: number
}

export interface TicTacToeState {
  board: number[][]
  player: number
}

export const ticTacToeBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

export function possibleMovesTicTacToe(state: TicTacToeState): TicTacToeMove[] {
  const result: TicTacToeMove[] = []
  state.board.forEach((rowArray, row) => {
    rowArray.forEach((value, col) => {
      if (value === 0) result.push({ row, col })
    })
  })
  return result
}

// Be careful not to mutate the board but to return a new one
export function playMoveTicTacToe(state: TicTacToeState, move: TicTacToeMove): TicTacToeState {
  const jSONBoard = JSON.stringify(state.board)
  const newBoard = JSON.parse(jSONBoard)
  newBoard[move.row][move.col] = state.player * -1
  const newState: TicTacToeState = {
    board: newBoard,
    player: state.player * -1
  }
  return newState
}

export function stateIsTerminalTicTacToe(state: TicTacToeState): boolean {
  for (let i = 0; i < 3; i++) {
    // check rows to see if there is a winner
    if (
      state.board[i][0] === state.board[i][1] &&
      state.board[i][1] === state.board[i][2] &&
      state.board[i][0] !== 0
    )
      return true

    // check cols to see if there is a winner
    if (
      state.board[0][i] === state.board[1][i] &&
      state.board[1][i] === state.board[2][i] &&
      state.board[0][i] !== 0
    )
      return true
  }

  // check diags to see if there is a winner
  if (
    state.board[0][0] === state.board[1][1] &&
    state.board[1][1] === state.board[2][2] &&
    state.board[0][0] !== 0
  )
    return true

  if (
    state.board[0][2] === state.board[1][1] &&
    state.board[1][1] === state.board[2][0] &&
    state.board[0][2] !== 0
  )
    return true

  // check to see if the board is full and therefore a draw
  const flattenBoard = state.board.reduce((p, c) => p.concat(c))
  if (flattenBoard.every(value => value !== 0)) return true

  return false
}

export function calculateRewardTicTacToe(state: TicTacToeState, player: number): number {
  for (let i = 0; i < 3; i++) {
    // check rows to see if there is a winner
    if (state.board[i][0] === state.board[i][1] && state.board[i][1] === state.board[i][2]) {
      if (state.board[i][0] === player) return 1

      return -1
    }

    // check cols to see if there is a winner
    if (state.board[0][i] === state.board[1][i] && state.board[1][i] === state.board[2][i]) {
      if (state.board[0][i] === player) return 1

      return -1
    }
  }

  // check diags to see if there is a winner
  if (state.board[0][0] === state.board[1][1] && state.board[1][1] === state.board[2][2]) {
    if (state.board[0][0] === player) return 1

    return -1
  }

  if (state.board[0][2] === state.board[1][1] && state.board[1][1] === state.board[2][0]) {
    if (state.board[0][2] === player) return 1

    return -1
  }

  return 0
}

export const ticTacToeFuncs = {
  generateActions: possibleMovesTicTacToe,
  applyAction: playMoveTicTacToe,
  stateIsTerminal: stateIsTerminalTicTacToe,
  calculateReward: calculateRewardTicTacToe
}
