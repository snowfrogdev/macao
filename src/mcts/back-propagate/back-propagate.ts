import { MCTSNode } from '../../entities'

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface BackPropagate
 * @template State
 * @template Action
 */
export interface BackPropagate<State, Action> {
  run: (node: MCTSNode<State, Action> | undefined, score: number) => void
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DefaultBackPropagate
 * @implements {BackPropagate<State, Action>}
 * @template State
 * @template Action
 */
export class DefaultBackPropagate<State, Action> implements BackPropagate<State, Action> {
  /**
   *
   *
   * @param {(MCTSNode<State, Action> | undefined)} node
   * @param {number} score
   * @memberof DefaultBackPropagate
   */
  run(node: MCTSNode<State, Action> | undefined, score: number): void {
    while (node) {
      node.mctsState.visits++
      node.mctsState.reward += score
      score *= -1
      node = node.parent
    }
  }
}
