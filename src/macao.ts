import { DefaultMCTSFacade } from './mcts'
import { Controller } from './controller'
import {
  Playerwise,
  GenerateActions,
  ApplyAction,
  StateIsTerminal,
  CalculateReward
} from './classes'

/**
 *
 *
 * @export
 * @class Macao
 * @template State
 * @template Action
 */
export default class Macao<State extends Playerwise, Action> {
  /**
   * @hidden
   * @internal
   * @private
   * @type {Controller<State, Action>}
   * @memberof Macao
   */
  private controller_: Controller<State, Action>

  /**
   * Creates an instance of Macao.
   * @param {{
   *       generateActions: GenerateActions<State, Action>;
   *       applyAction: ApplyAction<State, Action>;
   *       stateIsTerminal: StateIsTerminal<State>;
   *       calculateReward: CalculateReward<State>;
   *     }} funcs
   * @param {{
   *       duration: number;
   *       explorationParam?: number;
   *     }} config
   * @memberof Macao
   */
  constructor(
    funcs: {
      generateActions: GenerateActions<State, Action>
      applyAction: ApplyAction<State, Action>
      stateIsTerminal: StateIsTerminal<State>
      calculateReward: CalculateReward<State>
    },
    config: {
      duration: number
      explorationParam?: number
    }
  ) {
    this.controller_ = new Controller(funcs, config)
  }

  /**
   *
   *
   * @param {State} state
   * @returns {Action}
   * @memberof Macao
   */
  getAction(state: State): Action {
    return this.controller_.getAction(state)
  }

  /**
   *
   *
   * @param {{
   *       generateActions: GenerateActions<State, Action>
   *       applyAction: ApplyAction<State, Action>
   *       stateIsTerminal: StateIsTerminal<State>
   *       calculateReward: CalculateReward<State>
   *     }} funcs
   * @param {{
   *       duration: number
   *       explorationParam?: number
   *     }} config
   * @returns {this}
   * @memberof Macao
   */
  init(
    funcs: {
      generateActions: GenerateActions<State, Action>
      applyAction: ApplyAction<State, Action>
      stateIsTerminal: StateIsTerminal<State>
      calculateReward: CalculateReward<State>
    },
    config: {
      duration: number
      explorationParam?: number
    }
  ): this {
    this.controller_.init(funcs, config)
    return this
  }
}
