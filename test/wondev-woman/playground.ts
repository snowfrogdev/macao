import { loopFor } from '../../src/utils'
import { WondevSquare, WondevState, wondevFuncs, WondevAction } from './wondev-woman'
import { Macao } from '../../src/macao'

let draws = 0
let wins = 0
let losses = 0

let player = -1
let gamesPlayed = 0
let gamesLeft = 5000
const simStartTime = Date.now()
let averageGameTime = 0
let marginOfError = 0.15

loopFor(gamesLeft).turns(() => {
  const gameStartTime = Date.now()
  const boardSize = 5
  const board: WondevSquare[][] = []

  for (let i = 0; i < boardSize; i++) {
    const row: WondevSquare[] = []
    for (let j = 0; j < boardSize; j++) {
      row.push({ height: 0, unit: undefined })
    }
    board.push(row)
  }

  let state: WondevState = {
    board,
    player: -1,
    playerUnitsPos: [{ x: 0, y: 0 }],
    opponentUnitsPos: [{ x: 4, y: 4 }],
    playerScore: 0,
    opponentScore: 0,
    playerEnded: false,
    opponentEnded: false
  }
  state.board[0][0].unit = 1
  state.board[4][4].unit = -1

  /***************************************************************************/
  const player1 = new Macao(
    {
      stateIsTerminal: wondevFuncs.stateIsTerminal,
      generateActions: wondevFuncs.generateActions,
      applyAction: wondevFuncs.applyAction,
      calculateReward: wondevFuncs.calculateReward
    },
    { duration: 40, decayingParam: 0.9 }
  )
  /***************************************************************************/
  const player2 = new Macao(
    {
      stateIsTerminal: wondevFuncs.stateIsTerminal,
      generateActions: wondevFuncs.generateActions,
      applyAction: wondevFuncs.applyAction,
      calculateReward: wondevFuncs.calculateReward
    },
    { duration: 40 }
  )

  /***************************************************************************/
  let isPlayerOneFirstTurn = true
  let isPlayerTwoFirstTurn = true
  while (!wondevFuncs.stateIsTerminal(state)) {
    // Player 1
    let action!: WondevAction
    if (state.player === -1) {
      action = isPlayerOneFirstTurn ? player1.getAction(state, 950) : player1.getAction(state)
      isPlayerOneFirstTurn = false
    }

    // Player -1
    if (state.player === 1) {
      action = isPlayerTwoFirstTurn ? player2.getAction(state, 950) : player2.getAction(state)
      isPlayerTwoFirstTurn = false
    }

    // if (!action) throw new Error("Looks like both players were skipped.");
    // Apply action to state
    state = wondevFuncs.applyAction(state, action)
  }

  // When game is over update cumulative results and switch player's turn
  const result = wondevFuncs.calculateReward(state, 1)
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

    // Statitics
    const z = 1.96
    const sampleSize = wins + losses
    const p = 0.5
    const neededSampleSize = z * z * p * (1 - p) / (marginOfError * marginOfError)
    const aP = wins / sampleSize
    const c = z * Math.sqrt(aP * (1 - aP) / sampleSize)

    const estimatedTimeLeft = averageGameTime * gamesLeft
    console.log(
      `Elapsed Time: ${Math.round(simElapsedTime)} minutes. Estimated time left: ${Math.round(
        estimatedTimeLeft
      )} minutes.`
    )

    if (sampleSize >= neededSampleSize) {
      // If actual margin of error is smaller than the difference between half the win% and 50%
      if (c < Math.abs(aP - 0.5) / 2) {
        if (aP > 0.5) {
          console.log(`All done. 95% confidence that Player1 is better than Player2`)
          return true
        }
        if (aP < 0.5) {
          console.log(`All done. 95% confidence that Player2 is better than Player1`)
          return true
        }
        console.log(`All done. 95% confidence that both players are of equal strength.`)
        return true
      }
      marginOfError = c
    }
  }
})

// When simulation is over play system beep
process.stdout.write('\x07')
console.log('WondevWoman test over.')
