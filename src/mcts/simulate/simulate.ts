import {
  Playerwise,
  StateIsTerminal,
  GenerateActions,
  ApplyAction,
  CalculateReward
} from '../../entities'
import { spliceRandom } from '../../utils'

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface Simulate
 * @template State
 * @template Action
 */
export interface Simulate<State, Action> {
  run: (state: State) => number
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DefaultSimulate
 * @implements {Simulate<State, Action>}
 * @template State
 * @template Action
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
   *
   *
   * @param {State} state
   * @returns {number}
   * @memberof DefaultSimulate
   */
  run(state: State): number {
    const player = state.player
    while (!this.stateIsTerminal_(state)) {
      // Generate possible actions
      const actions = this.generateActions_(state)

      // Select an action at random
      const action = spliceRandom(actions)

      // Apply action and create new state
      state = this.applyAction_(state, action)
    }
    return this.calculateReward_(state, player)
  }
}
