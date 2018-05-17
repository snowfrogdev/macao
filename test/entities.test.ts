import { DefaultGameRules } from './../src/entities'
describe('The GameRules instance', () => {
  describe('when being created', () => {
    let funcs
    beforeEach(() => {
      funcs = {
        generateActions: state => state,
        applyAction: (state, action) => state,
        stateIsTerminal: state => true,
        calculateReward: (state, player) => state
      }
    })
    it('should validate that generateActions is a function that takes one argument', () => {
      expect(new DefaultGameRules(funcs).generateActions).toBe(funcs.generateActions)
      funcs.generateActions = ''
      expect(() => new DefaultGameRules(funcs)).toThrow(
        'Expected generateActions to be a function that takes one argument.'
      )
      funcs.generateActions = (state, extraParam) => state
      expect(() => new DefaultGameRules(funcs)).toThrow(
        'Expected generateActions to be a function that takes one argument.'
      )
    })
    it('should validate that applyAction is a function that takes two arguments', () => {
      expect(new DefaultGameRules(funcs).applyAction).toBe(funcs.applyAction)
      funcs.applyAction = ''
      expect(() => new DefaultGameRules(funcs)).toThrow(
        'Expected applyAction to be a function that takes two arguments.'
      )
      funcs.generateActions = state => state
      expect(() => new DefaultGameRules(funcs)).toThrow(
        'Expected applyAction to be a function that takes two arguments.'
      )
    })
    it('should validate that stateIsTerminal is a function that takes one argument', () => {
      expect(new DefaultGameRules(funcs).stateIsTerminal).toBe(funcs.stateIsTerminal)
      funcs.stateIsTerminal = ''
      expect(() => new DefaultGameRules(funcs)).toThrow(
        'Expected stateIsTerminal to be a function that takes one argument.'
      )
      funcs.stateIsTerminal = (state, extraParam) => state
      expect(() => new DefaultGameRules(funcs)).toThrow(
        'Expected stateIsTerminal to be a function that takes one argument.'
      )
    })
    it('should validate that calculateReward is a function that takes two arguments', () => {
      expect(new DefaultGameRules(funcs).calculateReward).toBe(funcs.calculateReward)
      funcs.calculateReward = ''
      expect(() => new DefaultGameRules(funcs)).toThrow(
        'Expected calculateReward to be a function that takes two arguments.'
      )
      funcs.calculateReward = (state, player, extraParam) => state
      expect(() => new DefaultGameRules(funcs)).toThrow(
        'Expected calculateReward to be a function that takes two arguments.'
      )
    })
  })
})
