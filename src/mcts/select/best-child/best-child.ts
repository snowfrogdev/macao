import { MCTSNode, Playerwise, MCTSState } from '../../../entities'

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface BestChild
 * @template State
 * @template Action
 */
export interface BestChild<State, Action> {
  run: (node: MCTSNode<State, Action>, explorationParam: number) => MCTSNode<State, Action>
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DefaultBestChild
 * @implements {BestChild<State, Action>}
 * @template State
 * @template Action
 */
export class DefaultBestChild<State extends Playerwise, Action>
  implements BestChild<State, Action> {
  /**
   * Creates an instance of DefaultBestChild.
   * @param {UCB1<State, Action>} UCB1_
   * @memberof DefaultBestChild
   */
  constructor(private UCB1_: UCB1<State, Action>) {}

  /**
   *
   *
   * @param {MCTSNode<State, Action>} node
   * @param {number} explorationParam
   * @returns {MCTSNode<State, Action>}
   * @memberof DefaultBestChild
   */
  run(node: MCTSNode<State, Action>, explorationParam: number): MCTSNode<State, Action> {
    if (!node.children.length) {
      throw new Error('Cannot find the best children as the current node does not have children')
    }

    const selectedNode = node.children.reduce((p, c) => {
      return this.UCB1_.run(node.mctsState, p.mctsState, explorationParam) >
        this.UCB1_.run(node.mctsState, c.mctsState, explorationParam)
        ? p
        : c
    })

    return selectedNode
  }
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface UCB1
 * @template State
 * @template Action
 */
export interface UCB1<State, Action> {
  run(
    parent: MCTSState<State, Action>,
    child: MCTSState<State, Action>,
    explorationParam: number
  ): number
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DefaultUCB1
 * @implements {UCB1<State, Action>}
 * @template State
 * @template Action
 */
export class DefaultUCB1<State, Action> implements UCB1<State, Action> {
  /**
   *
   *
   * @param {MCTSState<State, Action>} parent
   * @param {MCTSState<State, Action>} child
   * @param {number} explorationParam
   * @returns {number}
   * @memberof DefaultUCB1
   */
  run(
    parent: MCTSState<State, Action>,
    child: MCTSState<State, Action>,
    explorationParam: number
  ): number {
    const exploitationTerm = child.reward / child.visits
    const explorationTerm = Math.sqrt(Math.log(parent.visits) / child.visits)
    return exploitationTerm + explorationParam * explorationTerm
  }
}
