import {
  ApplyAction,
  CalculateReward,
  GenerateActions,
  Playerwise,
  StateIsTerminal
} from '../../entities'
import { getRandomIntInclusive } from '../../utils'

/**
 * The Simulate interface provides a playthrough of the game and is
 * a part of the Monte Carlo Tree Search algorithm.
 * @hidden
 * @internal
 */
export interface Simulate<State, Action> {
  run: (state: State) => number
}

/**
 * The DefaultSimulate class provides, trough it's [[run]] method,
 * a standard playthrough of the game where each move is selected entirely at random.
 * @hidden
 * @internal
 */
export class DefaultSimulate<State extends Playerwise, Action> implements Simulate<State, Action> {
  /**
   * Creates an instance of DefaultSimulate.
   * @param {StateIsTerminal<State>} stateIsTerminal_
   * @param {GenerateActions<State, Action>} generateActions_
   * @param {ApplyAction<State, Action>} applyAction_
   * @param {CalculateReward<State>} calculateReward_
   * @memberof DefaultSimulate
   */
  constructor(
    private stateIsTerminal_: StateIsTerminal<State>,
    private generateActions_: GenerateActions<State, Action>,
    private applyAction_: ApplyAction<State, Action>,
    private calculateReward_: CalculateReward<State>
  ) {}

  /**
   * The `run` method of the [[DefaultSimulate]] class runs a standard,
   * entirely random, simulation of the game and returns a number representing
   * the result of the simulation from the perspective of the player who's just
   * played a move and is now waiting for his opponent's turn.
   * @param {State} state An object representing the state of the game.
   * @returns {number}
   * @memberof DefaultSimulate
   */
  run(state: State): number {
    const player = state.player
    while (!this.stateIsTerminal_(state)) {
      // Generate possible actions
      const actions = this.generateActions_(state)

      // Select an action at random
      const index = getRandomIntInclusive(0, actions.length - 1)
      const action = actions[index]

      // Apply action and create new state
      state = this.applyAction_(state, action)
    }
    return this.calculateReward_(state, player)
  }
}
