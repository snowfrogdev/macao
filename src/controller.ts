import {
  GenerateActions,
  ApplyAction,
  StateIsTerminal,
  CalculateReward,
  Playerwise,
  MCTSState
} from './entities'
import { MCTSFacade, DefaultMCTSFacade } from './mcts/mcts'
import { DataStore } from './data-store'
import { DefaultSelect } from './mcts/select/select'
import { DefaultExpand } from './mcts/expand/expand'
import { UCB1, DefaultUCB1, DefaultBestChild } from './mcts/select/best-child/best-child'
import { DefaultSimulate, Simulate, DecisiveMoveSimulate } from './mcts/simulate/simulate'
import { DefaultBackPropagate } from './mcts/back-propagate/back-propagate'

/**
 *
 * @hidden
 * @internal
 * @export
 * @class Controller
 * @template State
 * @template Action
 */
export class Controller<State extends Playerwise, Action> {
  private mcts_!: MCTSFacade<State, Action>
  private duration_!: number
  private explorationParam_!: number
  private simulate_!: string[]

  /**
   * Creates an instance of Controller.
   * @param {{
   *     generateActions: GenerateActions<State, Action>;
   *     applyAction: ApplyAction<State, Action>;
   *     stateIsTerminal: StateIsTerminal<State>;
   *     calculateReward: CalculateReward<State>;
   *   }} funcs
   * @param {{
   *     duration: number;
   *     explorationParam?: number;
   *   }} config
   * @memberof Controller
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
      simulate?: string[]
    }
  ) {
    this.duration_ = config.duration
    this.explorationParam_ = config.explorationParam || 1.414
    this.simulate_ = config.simulate || []

    this.init(funcs)
  }

  /**
   *
   *
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
   * @memberof Controller
   */
  init(funcs: {
    generateActions: GenerateActions<State, Action>
    applyAction: ApplyAction<State, Action>
    stateIsTerminal: StateIsTerminal<State>
    calculateReward: CalculateReward<State>
  }) {
    // This is where we bootstrap the library according to initialization options.
    const data: Map<string, MCTSState<State, Action>> = new Map()
    const dataStore = new DataStore(data)
    const expand = new DefaultExpand(funcs.applyAction, funcs.generateActions, dataStore)
    const UCB1: UCB1<State, Action> = new DefaultUCB1()
    const bestChild = new DefaultBestChild(UCB1)
    const select = new DefaultSelect(funcs.stateIsTerminal, expand, bestChild)

    let simulate: Simulate<State, Action>
    if (this.simulate_.includes('decisive')) {
      simulate = new DecisiveMoveSimulate(
        funcs.stateIsTerminal,
        funcs.generateActions,
        funcs.applyAction,
        funcs.calculateReward
      )
    } else {
      simulate = new DefaultSimulate(
        funcs.stateIsTerminal,
        funcs.generateActions,
        funcs.applyAction,
        funcs.calculateReward
      )
    }

    const backPropagate = new DefaultBackPropagate()
    this.mcts_ = new DefaultMCTSFacade(
      select,
      expand,
      simulate,
      backPropagate,
      bestChild,
      funcs.generateActions,
      dataStore,
      this.duration_,
      this.explorationParam_
    )
  }

  /**
   *
   *
   * @param {State} state
   * @returns {Action}
   * @memberof Controller
   */
  getAction(state: State, duration?: number): Action {
    return this.mcts_.getAction(state, duration)
  }
}
