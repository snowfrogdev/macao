import {
  GenerateActions,
  ApplyAction,
  StateIsTerminal,
  CalculateReward,
  Playerwise,
  MCTSState
} from './classes'
import {
  MCTSFacade,
  DefaultMCTSFacade,
  DefaultSelect,
  DefaultExpand,
  DefaultBestChild,
  DefaultUCB1,
  UCB1,
  DefaultSimulate,
  DefaultBackPropagate
} from './mcts'
import { DataStore } from './data-store'

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
    }
  ) {
    this.init(funcs, config)
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
  ) {
    this.duration_ = config.duration

    // This is where we bootstrap the library according to initialization options.
    this.explorationParam_ = config.explorationParam || 1.414
    const data: Map<string, MCTSState<State, Action>> = new Map()
    const dataStore = new DataStore(data)
    const expand = new DefaultExpand(funcs.applyAction, funcs.generateActions, dataStore)
    const UCB1: UCB1<State, Action> = new DefaultUCB1()
    const bestChild = new DefaultBestChild(UCB1)
    const select = new DefaultSelect(funcs.stateIsTerminal, expand, bestChild)
    const simulate = new DefaultSimulate(
      funcs.stateIsTerminal,
      funcs.generateActions,
      funcs.applyAction,
      funcs.calculateReward
    )
    const backPropagate = new DefaultBackPropagate()
    this.mcts_ = new DefaultMCTSFacade(
      select,
      expand,
      simulate,
      backPropagate,
      bestChild,
      funcs.generateActions,
      dataStore,
      config.duration,
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
