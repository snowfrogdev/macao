import {
  MCTSNode,
  StateIsTerminal,
  Playerwise,
  ApplyAction,
  MCTSState,
  GenerateActions,
  CalculateReward
} from '../entities'
import { Select } from './select/select'
import { BestChild } from './select/best-child/best-child'
import { Expand } from './expand/expand'
import { Simulate } from './simulate/simulate'
import { BackPropagate } from './back-propagate/back-propagate'
import { spliceRandom, loopFor } from '../utils'

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface DataGateway
 * @template Key
 * @template Value
 */
export interface DataGateway<State, Action> {
  get: (key: State) => MCTSState<State, Action> | undefined
  set: (key: State, value: MCTSState<State, Action>) => this
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface MCTSFacade
 * @template State
 * @template Action
 */
export interface MCTSFacade<State, Action> {
  getAction: (state: State, duration?: number) => Action
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DefaultMCTSFacade
 * @implements {MCTSFacade<State, Action>}
 * @template State
 * @template Action
 */
export class DefaultMCTSFacade<State extends Playerwise, Action>
  implements MCTSFacade<State, Action> {
  /**
   * Creates an instance of DefaultMCTSFacade.
   * @param {Select<State, Action>} select_
   * @param {Expand<State, Action>} expand_
   * @param {Simulate<State, Action>} simulate_
   * @param {BackPropagate<State, Action>} backPropagate_
   * @param {BestChild<State, Action>} bestChild_
   * @param {GenerateActions<State, Action>} generateActions_
   * @param {DataGateway<string, MCTSState<State, Action>>} dataStore_
   * @param {number} duration_
   * @param {number} explorationParam_
   * @memberof DefaultMCTSFacade
   */
  constructor(
    private select_: Select<State, Action>,
    private expand_: Expand<State, Action>,
    private simulate_: Simulate<State, Action>,
    private backPropagate_: BackPropagate<State, Action>,
    private bestChild_: BestChild<State, Action>,
    private generateActions_: GenerateActions<State, Action>,
    private dataStore_: DataGateway<State, Action>,
    private duration_: number,
    private explorationParam_: number
  ) {}

  /**
   *
   *
   * @param {State} state
   * @returns {Action}
   * @memberof DefaultMCTSFacade
   */
  getAction(state: State, duration?: number): Action {
    const rootNode = this.createRootNode_(state)
    loopFor(duration || this.duration_).milliseconds(() => {
      const node = this.select_.run(rootNode)
      const score = this.simulate_.run(node.mctsState.state)
      this.backPropagate_.run(node, score)
    })
    const bestChild = this.bestChild_.run(rootNode, true)
    return bestChild!.action as Action
  }

  /**
   *
   *
   * @private
   * @param {State} state
   * @returns {MCTSNode<State, Action>}
   * @memberof DefaultMCTSFacade
   */
  private createRootNode_(state: State): MCTSNode<State, Action> {
    // Check to see if state is already in DataStore
    let mctsState = this.dataStore_.get(state)
    // If it isn't, create a new MCTSState and store it
    if (!mctsState) {
      mctsState = new MCTSState(state)
      this.dataStore_.set(state, mctsState)
    }
    // Create new MCTSNode
    const node = new MCTSNode(mctsState, this.generateActions_(state))
    return node
  }
}
