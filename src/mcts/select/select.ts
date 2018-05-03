import { MCTSNode, Playerwise, StateIsTerminal } from '../../entities'
import { Expand } from '../expand/expand'
import { BestChild } from './best-child/best-child'

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface Select
 * @template State
 * @template Action
 */
export interface Select<State, Action> {
  run: (node: MCTSNode<State, Action>, explorationParam: number) => MCTSNode<State, Action>
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DefaultSelect
 * @implements {Select<State, Action>}
 * @template State
 * @template Action
 */
export class DefaultSelect<State extends Playerwise, Action> implements Select<State, Action> {
  /**
   * Creates an instance of DefaultSelect.
   * @param {StateIsTerminal<State>} stateIsTerminal_
   * @param {Expand<State, Action>} expand_
   * @param {BestChild<State, Action>} bestChild_
   * @memberof DefaultSelect
   */
  constructor(
    private stateIsTerminal_: StateIsTerminal<State>,
    private expand_: Expand<State, Action>,
    private bestChild_: BestChild<State, Action>
  ) {}

  /**
   *
   *
   * @param {MCTSNode<State, Action>} node
   * @param {number} explorationParam
   * @returns {MCTSNode<State, Action>}
   * @memberof DefaultSelect
   */
  run(node: MCTSNode<State, Action>, explorationParam: number): MCTSNode<State, Action> {
    while (!this.stateIsTerminal_(node.mctsState.state)) {
      if (node.isNotFullyExpanded()) {
        return this.expand_.run(node)
      }
      node = this.bestChild_.run(node, explorationParam)
    }
    return node
  }
}
