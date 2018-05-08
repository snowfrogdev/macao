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
  constructor(private decayingParam: number) {}
  run(node: MCTSNode<State, Action> | undefined, score: number): void {
    while (node) {
      node.mctsState.visits++
      node.mctsState.reward += score

      // Flip reward
      score *= -1

      // Decay reward
      score *= this.decayingParam

      node = node.parent
    }
  }
}
