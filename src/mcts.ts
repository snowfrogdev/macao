import {
  MCTSNode,
  StateIsTerminal,
  Playerwise,
  ApplyAction,
  MCTSState,
  GenerateActions,
  CalculateReward
} from './classes'
import { spliceRandom, loopFor } from './utils'
import { performance } from 'perf_hooks'

/**
 *
 * @hidden
 * @internal
 * @export
 * @interface DataGateway
 * @template Key
 * @template Value
 */
export interface DataGateway<Key, Value> {
  get: (key: Key) => Value | undefined
  set: (key: Key, value: Value) => this
}

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
 * @interface Simulate
 * @template State
 * @template Action
 */
export interface Simulate<State, Action> {
  run: (state: State) => number
}

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DefaultSimulate
 * @implements {Simulate<State, Action>}
 * @template State
 * @template Action
 */
export class DefaultSimulate<State extends Playerwise, Action> implements Simulate<State, Action> {
  /**
   * Creates an instance of DefaultSimulate.
   * @param {StateIsTerminal<State>} stateIsTerminal_
   * @param {GenerateActions<State, Action>} generateActions_
   * @param {ApplyAction<State, Action>} applyAction_
   * @param {CalculateReward<State>} calculateReward_
   * @memberof DefaultSimulate
   */
  constructor(
    private stateIsTerminal_: StateIsTerminal<State>,
    private generateActions_: GenerateActions<State, Action>,
    private applyAction_: ApplyAction<State, Action>,
    private calculateReward_: CalculateReward<State>
  ) {}

  /**
   *
   *
   * @param {State} state
   * @returns {number}
   * @memberof DefaultSimulate
   */
  run(state: State): number {
    const player = state.player
    while (!this.stateIsTerminal_(state)) {
      // Generate possible actions
      const actions = this.generateActions_(state)

      // Select an action at random
      const action = spliceRandom(actions)

      // Apply action and create new state
      state = this.applyAction_(state, action)
    }
    return this.calculateReward_(state, player)
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
    private dataStore_: DataGateway<string, MCTSState<State, Action>>,
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
      performance.mark('select start')
      const node = this.select_.run(rootNode, this.explorationParam_)
      performance.mark('select end')
      performance.mark('simulate start')
      const score = this.simulate_.run(node.mctsState.state)
      performance.mark('simulate end')
      performance.mark('backPropagate start')
      this.backPropagate_.run(node, score)
      performance.mark('backPropagate end')
      performance.measure('select', 'select start', 'select end')
      performance.measure('simulate', 'simulate start', 'simulate end')
      performance.measure('backPropagate', 'backPropagate start', 'backPropagate end')
    })

    const bestChild = this.bestChild_.run(rootNode, 0)

    return bestChild.action as Action
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
    // Check to see if state is already in Map
    const stringifiedState = JSON.stringify(state)
    let mctsState = this.dataStore_.get(stringifiedState)
    // If it isn't, create a new MCTSState and store it in the map
    if (!mctsState) {
      mctsState = new MCTSState(state)
      this.dataStore_.set(stringifiedState, mctsState)
    }
    // Create new MCTSNode
    const node = new MCTSNode(mctsState, this.generateActions_(state))
    return node
  }
}
