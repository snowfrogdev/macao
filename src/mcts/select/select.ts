import { MCTSNode, Playerwise, StateIsTerminal } from '../../entities'
import { Expand } from '../expand/expand'
import { BestChild, UCB1 } from './best-child/best-child'

/**
 * The Select interface represents the Selection part of the Monte Carlo Tree
 * Search algorithm. This part of the algorithm deals with choosing which node
 * in the tree to run a simulation on.
 * @hidden
 * @internal
 */
export interface Select<State, Action> {
  run: (node: MCTSNode<State, Action>) => MCTSNode<State, Action>
}

/**
 * The DefaultSelect class provides the standard Monte Carlo Tree Search algorithm
 * with the selection phase. Through it's [[run]] method, when supplied with a tree
 * node, it will provide another tree node from which to run a simulation.
 * @hidden
 * @internal
 */
export class DefaultSelect<State extends Playerwise, Action> implements Select<State, Action> {
  constructor(
    private stateIsTerminal_: StateIsTerminal<State>,
    private expand_: Expand<State, Action>,
    private bestChild_: BestChild<State, Action>,
    private ucb1_: UCB1<State, Action>,
    private fpuParam_: number
  ) {}

  run(node: MCTSNode<State, Action>): MCTSNode<State, Action> {
    while (!this.stateIsTerminal_(node.mctsState.state)) {
      const child = this.bestChild_.run(node)
      if (!child) return this.expand_.run(node)
      if (node.isNotFullyExpanded()) {
        const sumChildVisits = node.children.reduce((p, c) => p + c.mctsState.visits, 0)
        const ucb1 = this.ucb1_.run(sumChildVisits, child.mctsState)
        if (ucb1 < this.fpuParam_) {
          return this.expand_.run(node)
        }
      }
      node = child
    }
    return node
  }
}
