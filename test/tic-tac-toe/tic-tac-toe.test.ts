import { DefaultMCTSFacade, DataGateway, MCTSFacade } from '../../src/mcts/mcts'
import { MCTSState } from '../../src/entities'
import { TicTacToeState, TicTacToeMove, ticTacToeFuncs } from './tic-tac-toe'
import { DataStore } from '../../src/data-store'
import { loopFor } from '../../src/utils'
import { Macao } from '../../src/macao'
import { Expand, DefaultExpand } from '../../src/mcts/expand/expand'
import {
  BestChild,
  DefaultBestChild,
  DefaultUCB1
} from '../../src/mcts/select/best-child/best-child'
import { Select, DefaultSelect } from '../../src/mcts/select/select'
import { Simulate, DefaultSimulate } from '../../src/mcts/simulate/simulate'
import { BackPropagate, DefaultBackPropagate } from '../../src/mcts/back-propagate/back-propagate'

xdescribe('The DefaultMCTSFacade instance', () => {
  let dataStore: DataGateway<string, MCTSState<TicTacToeState, TicTacToeMove>>
  let expand: Expand<TicTacToeState, TicTacToeMove>
  let bestChild: BestChild<TicTacToeState, TicTacToeMove>
  let select: Select<TicTacToeState, TicTacToeMove>
  let simulate: Simulate<TicTacToeState, TicTacToeMove>
  let backPropagate: BackPropagate<TicTacToeState, TicTacToeMove>
  let mcts: MCTSFacade<TicTacToeState, TicTacToeMove>
  let ticTacToeBoard
  let state: TicTacToeState

  describe('when used to simulate 100 Tic Tac Toe games', () => {
    describe('given 100 ms per turn and an exploration param of 1.414', () => {
      it('should end in a draw 95% of the time or better', () => {
        let results = 0
        loopFor(100).turns(() => {
          const map = new Map()
          dataStore = new DataStore(map)
          expand = new DefaultExpand(
            ticTacToeFuncs.applyAction,
            ticTacToeFuncs.generateActions,
            dataStore
          )
          bestChild = new DefaultBestChild(new DefaultUCB1())
          select = new DefaultSelect(ticTacToeFuncs.stateIsTerminal, expand, bestChild)
          simulate = new DefaultSimulate(
            ticTacToeFuncs.stateIsTerminal,
            ticTacToeFuncs.generateActions,
            ticTacToeFuncs.applyAction,
            ticTacToeFuncs.calculateReward
          )
          backPropagate = new DefaultBackPropagate()
          mcts = new DefaultMCTSFacade(
            select,
            expand,
            simulate,
            backPropagate,
            bestChild,
            ticTacToeFuncs.generateActions,
            dataStore,
            40,
            1.414
          )
          ticTacToeBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
          state = {
            board: ticTacToeBoard,
            player: 1
          }
          while (!ticTacToeFuncs.stateIsTerminal(state)) {
            const action = mcts.getAction(state)
            state = ticTacToeFuncs.applyAction(state, action)
          }

          results += ticTacToeFuncs.calculateReward(state, 1) === 0 ? 1 : 0
        })
        expect(results).toBeGreaterThan(95)
      })
    })
  })
})

xdescribe('The Macao instance', () => {
  let ticTacToeBoard
  let state: TicTacToeState
  let mcts: Macao<TicTacToeState, TicTacToeMove>

  describe('when used to simulate 100 Tic Tac Toe games', () => {
    describe('given 100 ms per turn and an exploration param of 1.414', () => {
      it('should end in a draw 95% of the time or better', () => {
        let results = 0
        loopFor(100).turns(() => {
          mcts = new Macao(
            {
              stateIsTerminal: ticTacToeFuncs.stateIsTerminal,
              generateActions: ticTacToeFuncs.generateActions,
              applyAction: ticTacToeFuncs.applyAction,
              calculateReward: ticTacToeFuncs.calculateReward
            },
            { duration: 100 }
          )
          ticTacToeBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
          state = {
            board: ticTacToeBoard,
            player: 1
          }
          while (!ticTacToeFuncs.stateIsTerminal(state)) {
            const action = mcts.getAction(state)
            state = ticTacToeFuncs.applyAction(state, action)
          }

          results += ticTacToeFuncs.calculateReward(state, 1) === 0 ? 1 : 0
        })
        expect(results).toBeGreaterThan(95)
      })
    })
  })
})
