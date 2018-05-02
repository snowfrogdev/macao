import { Macao } from '../../src/macao'
import { ticTacToeFuncs } from './tic-tac-toe'

const ticTacToeBoard = [[1, -1, 1], [-1, -1, 1], [-1, 1, -1]]
let state = {
  board: ticTacToeBoard,
  player: 1
}

const mcts = new Macao(
  {
    stateIsTerminal: ticTacToeFuncs.stateIsTerminal,
    generateActions: ticTacToeFuncs.generateActions,
    applyAction: ticTacToeFuncs.applyAction,
    calculateReward: ticTacToeFuncs.calculateReward
  },
  { duration: 100 }
)

mcts.getAction(state)
