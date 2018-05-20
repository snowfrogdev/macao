import { ApplyAction, GenerateActions, MCTSNode, MCTSState, Playerwise } from '../../entities'
import { spliceRandom } from '../../utils'
import { DataGateway } from '../mcts'

/**
 * The Expand interface represents the Expansion part of the Monte Carlo Tree
 * Search algorithm. This part of the algorithm deals with adding a children Node
 * to a previously selected Node.
 * @hidden
 * @internal
 */
export interface Expand<State, Action> {
  run: (node: MCTSNode<State, Action>) => MCTSNode<State, Action>
}

/**
 * The DefaultExpand class provides the standard Monte Carlo Tree Search algorithm
 * with the expansion phase. Through it's [[run]] method, when supplied with a tree
 * node, it will expand the tree by adding a children node.
 * @hidden
 * @internal
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
