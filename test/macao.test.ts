import { Macao } from '../src/macao'
import { ticTacToeFuncs, TicTacToeState } from './tic-tac-toe/tic-tac-toe'

const macao = new Macao(
  {
    stateIsTerminal: ticTacToeFuncs.stateIsTerminal,
    generateActions: ticTacToeFuncs.generateActions,
    applyAction: ticTacToeFuncs.applyAction,
    calculateReward: ticTacToeFuncs.calculateReward
  },
  { duration: 100 }
)
describe('The Macao instance', () => {
  describe('when created', () => {
    it('should be an instance of Macao', () => {
      expect(macao).toBeInstanceOf(Macao)
    })
  })

  describe('when calling getAction', () => {
    it('should return something', () => {
      const ticTacToeBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
      const state: TicTacToeState = {
        board: ticTacToeBoard,
        player: 1
      }
      expect(macao.getAction(state)).toBeDefined()
    })
  })
})
