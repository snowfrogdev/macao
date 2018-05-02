import { UTicTacToeState, UTicTacToeMove, uTicTacToeFuncs } from './ultimate-tic-tac-toe'
import { Macao } from '../../src/macao'
import { loopFor } from '../../src/utils'

xdescribe('The Macao instance', () => {
  let uTicTacToeBoard: number[][][][]
  let state: UTicTacToeState
  let mcts: Macao<UTicTacToeState, UTicTacToeMove>

  describe('when used to simulate 100 Ultimate Tic Tac Toe games', () => {
    describe('given 85 ms per turn and an exploration param of 1.414', () => {
      it('should end in a draw 95% of the time or better', () => {
        let results = 0
        loopFor(100).turns(() => {
          mcts = new Macao(
            {
              stateIsTerminal: uTicTacToeFuncs.stateIsTerminal,
              generateActions: uTicTacToeFuncs.generateActions,
              applyAction: uTicTacToeFuncs.applyAction,
              calculateReward: uTicTacToeFuncs.calculateReward
            },
            { duration: 85 }
          )
          uTicTacToeBoard = [
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
          state = {
            board: uTicTacToeBoard,
            player: -1,
            previousAction: { bigRow: -1, bigCol: -1, smallRow: -1, smallCol: -1 }
          }
          while (!uTicTacToeFuncs.stateIsTerminal(state)) {
            const action = mcts.getAction(state)
            state = uTicTacToeFuncs.applyAction(state, action)
          }

          results += uTicTacToeFuncs.calculateReward(state, 1) === 0 ? 1 : 0
        })
        expect(results).toBeGreaterThan(95)
      })
    })
  })
})
