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
  run: (node: MCTSNode<State, Action>, exploit?: boolean) => MCTSNode<State, Action> | undefined
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
  run(node: MCTSNode<State, Action>, exploit = false): MCTSNode<State, Action> | undefined {
    if (!node.children.length) {
      return undefined
    }
    const sumChildVisits = node.children.reduce((p, c) => p + c.mctsState.visits, 0)
    const selectedNode = node.children.reduce((p, c) => {
      return this.UCB1_.run(sumChildVisits, p.mctsState, exploit) >
        this.UCB1_.run(sumChildVisits, c.mctsState, exploit)
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
  run(sumChildVisits: number, child: MCTSState<State, Action>, exploit?: boolean): number
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
  constructor(private explorationParam_: number) {}
  /**
   *
   *
   * @param {MCTSState<State, Action>} parent
   * @param {MCTSState<State, Action>} child
   * @param {number} explorationParam
   * @returns {number}
   * @memberof DefaultUCB1
   */
  run(sumChildVisits: number, child: MCTSState<State, Action>, exploit = false): number {
    if (exploit) this.explorationParam_ = 0
    const exploitationTerm = child.reward / child.visits
    const explorationTerm = Math.sqrt(Math.log(sumChildVisits) / child.visits)
    return exploitationTerm + this.explorationParam_ * explorationTerm
  }
}
