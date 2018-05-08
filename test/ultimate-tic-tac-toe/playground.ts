import { Macao } from '../../src/macao'
import { uTicTacToeFuncs, UTicTacToeMove } from './ultimate-tic-tac-toe'
import { loopFor, spliceRandom } from '../../src/utils'
import { DefaultSimulate } from '../../src/mcts/simulate/simulate'

/**
 * After one million random playouts, its seems that the odds, for the first player,
 * are 50.9% win, 7.2% draw, 41.9% loss.
 */

let draws = 0
let wins = 0
let losses = 0

let player = -1
let gamesPlayed = 0
let gamesLeft = 5000
const simStartTime = Date.now()
let averageGameTime = 0

loopFor(gamesLeft).turns(() => {
  const gameStartTime = Date.now()
  const uTicTacToeBoard = [
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
  let state = {
    board: uTicTacToeBoard,
    player: player,
    previousAction: { bigRow: -1, bigCol: -1, smallRow: -1, smallCol: -1 }
  }

  /***************************************************************************/
  const player1 = new Macao(
    {
      stateIsTerminal: uTicTacToeFuncs.stateIsTerminal,
      generateActions: uTicTacToeFuncs.generateActions,
      applyAction: uTicTacToeFuncs.applyAction,
      calculateReward: uTicTacToeFuncs.calculateReward
    },
    { duration: 91, transpoTable: 100000 }
  )
  /***************************************************************************/
  const player2 = new Macao(
    {
      stateIsTerminal: uTicTacToeFuncs.stateIsTerminal,
      generateActions: uTicTacToeFuncs.generateActions,
      applyAction: uTicTacToeFuncs.applyAction,
      calculateReward: uTicTacToeFuncs.calculateReward
    },
    { duration: 91 }
  )

  /***************************************************************************/

  while (!uTicTacToeFuncs.stateIsTerminal(state)) {
    // Player 1
    let action!: UTicTacToeMove
    if (state.player === -1) {
      action = player1.getAction(state)
    }

    // Player -1
    if (state.player === 1) {
      action = player2.getAction(state)
    }

    if (!action) throw new Error('Looks like both players were skipped.')
    // Apply action to state
    state = uTicTacToeFuncs.applyAction(state, action)
  }

  // When game is over update cumulative results and switch player's turn
  const result = uTicTacToeFuncs.calculateReward(state, 1)
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
