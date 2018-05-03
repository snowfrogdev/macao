import { MCTSNode, Playerwise, ApplyAction, GenerateActions, MCTSState } from '../../entities'
import { DataGateway } from '../mcts'
import { spliceRandom } from '../../utils'

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface Expand
 * @template State
 * @template Action
 */
export interface Expand<State, Action> {
  run: (node: MCTSNode<State, Action>) => MCTSNode<State, Action>
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DefaultExpand
 * @implements {Expand<State, Action>}
 * @template State
 * @template Action
 */
export class DefaultExpand<State extends Playerwise, Action> implements Expand<State, Action> {
  /**
   * Creates an instance of DefaultExpand.
   * @param {ApplyAction<State, Action>} applyAction_
   * @param {GenerateActions<State, Action>} generateActions_
   * @param {DataGateway<string, MCTSState<State, Action>>} dataStore_
   * @memberof DefaultExpand
   */
  constructor(
    private applyAction_: ApplyAction<State, Action>,
    private generateActions_: GenerateActions<State, Action>,
    private dataStore_: DataGateway<string, MCTSState<State, Action>>
  ) {}

  /**
   *
   *
   * @param {MCTSNode<State, Action>} node
   * @returns {MCTSNode<State, Action>}
   * @memberof DefaultExpand
   */
  run(node: MCTSNode<State, Action>): MCTSNode<State, Action> {
    const action = spliceRandom(node.possibleActionsLeftToExpand)
    const state = this.applyAction_(node.mctsState.state, action)
    // Check to see if state is already in Map
    const stringifiedState = JSON.stringify(state)
    let mctsState = this.dataStore_.get(stringifiedState)
    // If it isn't, create a new MCTSState and store it in the map
    if (!mctsState) {
      mctsState = new MCTSState(state)
      this.dataStore_.set(stringifiedState, mctsState)
    }
    const child = node.addChild(mctsState, this.generateActions_(state), action)
    return child
  }
}
