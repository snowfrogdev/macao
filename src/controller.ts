import {
  GenerateActions,
  ApplyAction,
  StateIsTerminal,
  CalculateReward,
  Playerwise,
  MCTSState
} from './entities'
import { MCTSFacade, DefaultMCTSFacade } from './mcts/mcts'
import { TranspositionTable, Collection, HashTable } from './data-store'
import { DefaultSelect, Select } from './mcts/select/select'
import { DefaultExpand, Expand } from './mcts/expand/expand'
import { UCB1, DefaultUCB1, DefaultBestChild } from './mcts/select/best-child/best-child'
import { DefaultSimulate, Simulate } from './mcts/simulate/simulate'
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
  private fpuParam_!: number
  private decayingParam_!: number
  private transpoTable_!: number | undefined

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
      fpuParam?: number
      decayingParam?: number
      transpoTable?: number
    }
  ) {
    this.duration_ = config.duration
    this.explorationParam_ = config.explorationParam || 1.414
    this.fpuParam_ = config.fpuParam || Infinity
    this.decayingParam_ = config.decayingParam || 1
    this.transpoTable_ = config.transpoTable

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
    let data: Collection<State, Action>
    if (this.transpoTable_) {
      data = new HashTable(this.transpoTable_)
    } else {
      data = new Map()
    }

    const transpositionTable = new TranspositionTable(data)
    const ucb1: UCB1<State, Action> = new DefaultUCB1(this.explorationParam_)
    const bestChild = new DefaultBestChild(ucb1)

    const expand = new DefaultExpand(funcs.applyAction, funcs.generateActions, transpositionTable)

    const select = new DefaultSelect(funcs.stateIsTerminal, expand, bestChild, ucb1, this.fpuParam_)

    const simulate = new DefaultSimulate(
      funcs.stateIsTerminal,
      funcs.generateActions,
      funcs.applyAction,
      funcs.calculateReward
    )

    const backPropagate = new DefaultBackPropagate(this.decayingParam_)
    this.mcts_ = new DefaultMCTSFacade(
      select,
      expand,
      simulate,
      backPropagate,
      bestChild,
      funcs.generateActions,
      transpositionTable,
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
