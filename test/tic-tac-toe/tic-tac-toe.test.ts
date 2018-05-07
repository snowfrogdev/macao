import { Macao } from '../../src/macao'
import { ticTacToeFuncs, TicTacToeState, TicTacToeMove } from './tic-tac-toe'
import { loopFor } from '../../src/utils'

xdescribe('The Macao instance', () => {
  describe('when used to simulate 50 Tic Tac Toe games', () => {
    describe('given 100 ms per turn and an exploration param of 1.414', () => {
      it('should end in a draw', () => {
        let draws = 0
        let wins = 0
        let losses = 0

        let player = -1
        let gamesPlayed = 0
        let gamesLeft = 50

        loopFor(gamesLeft).turns(() => {
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
            { duration: 100, explorationParam: 1.414 }
          )
          /***************************************************************************/
          const player2 = new Macao(
            {
              stateIsTerminal: ticTacToeFuncs.stateIsTerminal,
              generateActions: ticTacToeFuncs.generateActions,
              applyAction: ticTacToeFuncs.applyAction,
              calculateReward: ticTacToeFuncs.calculateReward
            },
            { duration: 100, explorationParam: 1.414 }
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
        })
        expect(draws).toBeGreaterThanOrEqual(40)
      })
    })
  })
})
