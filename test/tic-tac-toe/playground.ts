import { Macao } from '../../src/macao'
import { ticTacToeFuncs, TicTacToeState, TicTacToeMove } from './tic-tac-toe'
import { loopFor } from '../../src/utils'

let draws = 0
let wins = 0
let losses = 0

let player = -1
let gamesPlayed = 0
let gamesLeft = 1000
const simStartTime = Date.now()
let averageGameTime = 0

loopFor(gamesLeft).turns(() => {
  const gameStartTime = Date.now()
  const ticTacToeBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

  let state: TicTacToeState = {
    board: ticTacToeBoard,
    player: player
  }

  /***************************************************************************/
  const player1 = new Macao(
    {
      stateIsTerminal: ticTacToeFuncs.stateIsTerminal,
      generateActions: ticTacToeFuncs.generateActions,
      applyAction: ticTacToeFuncs.applyAction,
      calculateReward: ticTacToeFuncs.calculateReward
    },
    { duration: 91 }
  )
  /***************************************************************************/
  const player2 = new Macao(
    {
      stateIsTerminal: ticTacToeFuncs.stateIsTerminal,
      generateActions: ticTacToeFuncs.generateActions,
      applyAction: ticTacToeFuncs.applyAction,
      calculateReward: ticTacToeFuncs.calculateReward
    },
    { duration: 91 }
  )

  /***************************************************************************/

  while (!ticTacToeFuncs.stateIsTerminal(state)) {
    // Player 1
    let action!: TicTacToeMove
    if (state.player === -1) {
      action = player1.getAction(state)
    }

    // Player -1
    if (state.player === 1) {
      action = player2.getAction(state)
    }

    if (!action) throw new Error('Looks like both players were skipped.')
    // Apply action to state
    state = ticTacToeFuncs.applyAction(state, action)
  }

  // When game is over update cumulative results and switch player's turn
  const result = ticTacToeFuncs.calculateReward(state, 1)
  player *= -1

  switch (result) {
    case 0:
      draws++
      break
    case 1:
      wins++
      break
    case -1:
      losses++
      break
  }

  // Time calculations
  // Print cumulative results every 5 games.
  gamesPlayed++
  gamesLeft--
  const lastGameTime = (Date.now() - gameStartTime) / 1000 / 60
  if (gamesPlayed <= 5) averageGameTime += lastGameTime / 5
  if (gamesPlayed % 5 === 0) {
    console.log({ wins, draws, losses })
    const simElapsedTime = (Date.now() - simStartTime) / 1000 / 60
    averageGameTime = (lastGameTime - averageGameTime) * 0.33 + averageGameTime
    const estimatedTimeLeft = averageGameTime * gamesLeft
    console.log(
      `Elapsed Time: ${Math.round(simElapsedTime)} minutes. Estimated time left: ${Math.round(
        estimatedTimeLeft
      )} minutes.`
    )
  }
})

// When simulation is over play system beep
process.stdout.write('\x07')
