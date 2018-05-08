import { MCTSNode, Playerwise, ApplyAction, GenerateActions, MCTSState } from '../../entities'
import { DataGateway } from '../mcts'
import { spliceRandom } from '../../utils'
import { BestChild } from '../select/best-child/best-child'

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
 * @template State
 * @template Action
 */
export class DefaultExpand<State extends Playerwise, Action> implements Expand<State, Action> {
  constructor(
    private applyAction_: ApplyAction<State, Action>,
    private generateActions_: GenerateActions<State, Action>,
    private dataStore_: DataGateway<State, Action>
  ) {}

  run(node: MCTSNode<State, Action>): MCTSNode<State, Action> {
    const action = spliceRandom(node.possibleActionsLeftToExpand)
    const state = this.applyAction_(node.mctsState.state, action)
    // Check to see if state is already in Map
    let mctsState = this.dataStore_.get(state)
    // If it isn't, create a new MCTSState and store it in the map
    if (!mctsState) {
      mctsState = new MCTSState(state)
      this.dataStore_.set(state, mctsState)
    }
    const child = node.addChild(mctsState, this.generateActions_(state), action)
    return child
  }
}
