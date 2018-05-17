import { Collection, HashTable, TranspositionTable } from './data-store'
import {
  ApplyAction,
  CalculateReward,
  GenerateActions,
  Playerwise,
  StateIsTerminal,
  GameRules
} from './entities'
import { DefaultBackPropagate } from './mcts/back-propagate/back-propagate'
import { DefaultExpand } from './mcts/expand/expand'
import { DefaultMCTSFacade, MCTSFacade } from './mcts/mcts'
import { DefaultBestChild, DefaultUCB1, UCB1 } from './mcts/select/best-child/best-child'
import { DefaultSelect } from './mcts/select/select'
import { DefaultSimulate } from './mcts/simulate/simulate'

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

  constructor(
    funcs: GameRules<State, Action>,
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

  init(funcs: GameRules<State, Action>) {
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

  getAction(state: State, duration?: number): Promise<Action> {
    return this.mcts_.getAction(state, duration)
  }

  getActionSync(state: State, duration?: number): Action {
    return this.mcts_.getActionSync(state, duration)
  }
}
