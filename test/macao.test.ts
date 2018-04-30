import Macao from '../src/macao'
import { ticTacToeFuncs } from './tic-tac-toe/tic-tac-toe'

describe('The Macao instance', () => {
  describe('when created', () => {
    it('should be an instance of Macao', () => {
      expect(
        new Macao(
          {
            stateIsTerminal: ticTacToeFuncs.stateIsTerminal,
            generateActions: ticTacToeFuncs.generateActions,
            applyAction: ticTacToeFuncs.applyAction,
            calculateReward: ticTacToeFuncs.calculateReward
          },
          { duration: 100 }
        )
      ).toBeInstanceOf(Macao)
    })
  })
})
