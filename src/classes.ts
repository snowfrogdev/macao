/**
 * `Playerwise` is an interface made to extend generic `State` objects used in
 * the [[GameRules]] interface. It is meant to insure that, even though the shape
 * and implementation of the `State` object is left up to the user, it should
 * atleast have a `player` property.
 */
export interface Playerwise {
  player: number
}

/**
 * `GenerateActions` is a type of function that you provide that takes in a `State`
 * as an argument and returns an `Array` of possible `Action`s.
 *
 * ### Example
 * ```javascript
 * function(state) {
 *   const possibleActions = [];
 *
 *   // Some kind of algortihm that you implement and
 *   // pushes all possible Action(s) into an array.
 *
 *   return possibleActions;
 * }
 * ```
 * @param State An object representing the state of the game.
 * @param Action An object representing an action in the game.
 */
export interface GenerateActions<State extends Playerwise, Action> {
  (state: State): Action[]
}

/**
 * `ApplyAction` is a type of function that you provide that takes in a `State`
 * and an `Action` as arguments. It applies the `Action` to the `State` and returns
 * a new `State`.
 *
 * **IMPORTANT**
 * Make sure that the function indeed returns a NEW State and does not simply
 * mutate the provided State.
 *
 * ### Example
 * ```javascript
 * function(state, action) {
 *   let newState;
 *
 *   // Apply the action to state and create a new State object.
 *
 *   return newState;
 * }
 * ```
 * @param State An object representing the state of the game.
 * @param Action An object representing an action in the game.
 */
export interface ApplyAction<State extends Playerwise, Action> {
  (state: State, action: Action): State
}

/**
 * `StateIsTerminal` is a type of function that you provide that takes in a `State`
 * as an argument and returns `true` if the game is over and `false` otherwise.
 *
 * ### Example
 * ```javascript
 * function(state) {
 *   if (gameIsADraw(state) || gamesIsWon(state)) return true;
 *
 *   return false;
 * }
 * ```
 * @param State An object representing the state of the game.
 */
export interface StateIsTerminal<State extends Playerwise> {
  (state: State): boolean
}

/**
 * `CalculateReward` is a type of function that you provide that takes in a `State`
 * and a `number` representing the player, as arguments. Given the game `State`,
 * it calculates a reward for the player and returns that reward as a `number`.
 *
 * ### Example
 * ```javascript
 * function(state, player) {
 *   if (hasWon(state, player)) return 1;
 *
 *   if (isDraw(state)) return 0;
 *
 *   return -1;
 * }
 * ```
 * @param State An object representing the state of the game.
 */

export interface CalculateReward<State extends Playerwise> {
  (state: State, player: number): number
}

/**
 * `GameRules` is an interface for a class containing all the game functions provided
 * by the user.
 * @hidden
 * @internal
 * @param State An object representing the state of the game.
 * @param Action An object representing an action in the game.
 */
export interface GameRules<State extends Playerwise, Action> {
  generateActions: GenerateActions<State, Action>
  applyAction: ApplyAction<State, Action>
  stateIsTerminal: StateIsTerminal<State>
  calculateReward: CalculateReward<State>
}

/**
 * The `DefaultGameRules` class implements [[GameRules]] and contains all of the game
 * functions supplied by the user.
 * @hidden
 * @internal
 * @param State An object representing the state of the game.
 * @param Action An object representing an action in the game.
 */
export class DefaultGameRules<State extends Playerwise, Action>
  implements GameRules<State, Action> {
  private generateActions_!: GenerateActions<State, Action>
  private applyAction_!: ApplyAction<State, Action>
  private stateIsTerminal_!: StateIsTerminal<State>
  private calculateReward_!: CalculateReward<State>
  /**
   * Creates an instance of DefaultGameRules.
   * @param funcs an object containing all the of the game functions.
   */
  constructor(funcs: {
    generateActions: GenerateActions<State, Action>
    applyAction: ApplyAction<State, Action>
    stateIsTerminal: StateIsTerminal<State>
    calculateReward: CalculateReward<State>
  }) {
    this.generateActions = funcs.generateActions
    this.applyAction = funcs.applyAction
    this.stateIsTerminal = funcs.stateIsTerminal
    this.calculateReward = funcs.calculateReward
  }

  get generateActions(): GenerateActions<State, Action> {
    return this.generateActions_
  }
  set generateActions(value: GenerateActions<State, Action>) {
    if (typeof value !== 'function' || value.length !== 1) {
      throw new TypeError('Expected generateActions to be a function that takes one argument.')
    }
    this.generateActions_ = value
  }

  get applyAction(): ApplyAction<State, Action> {
    return this.applyAction_
  }
  set applyAction(value: ApplyAction<State, Action>) {
    if (typeof value !== 'function' || value.length !== 2) {
      throw new TypeError('Expected applyAction to be a function that takes two arguments.')
    }
    this.applyAction_ = value
  }

  get stateIsTerminal(): StateIsTerminal<State> {
    return this.stateIsTerminal_
  }
  set stateIsTerminal(value: StateIsTerminal<State>) {
    if (typeof value !== 'function' || value.length !== 1) {
      throw new TypeError('Expected stateIsTerminal to be a function that takes one argument.')
    }
    this.stateIsTerminal_ = value
  }

  get calculateReward(): CalculateReward<State> {
    return this.calculateReward_
  }
  set calculateReward(value: CalculateReward<State>) {
    if (typeof value !== 'function' || value.length !== 1) {
      throw new TypeError('Expected calculateReward to be a function that takes one argument.')
    }
    this.calculateReward_ = value
  }
}

/**
 *
 * @hidden
 * @internal
 * @param State An object representing the state of the game.
 */
export class MCTSNode<State, Action> {
  private possibleActionsLeftToExpand_: Action[]
  private children_: MCTSNode<State, Action>[] = []
  constructor(
    private mctsState_: MCTSState<State, Action>,
    possibleActions: Action[],
    private parent_?: MCTSNode<State, Action>,
    private action_?: Action
  ) {
    this.possibleActionsLeftToExpand_ = possibleActions
  }

  get mctsState(): MCTSState<State, Action> {
    return this.mctsState_
  }

  get possibleActionsLeftToExpand(): Action[] {
    return this.possibleActionsLeftToExpand_
  }

  get action(): Action | undefined {
    return this.action_
  }

  get children(): MCTSNode<State, Action>[] {
    return this.children_
  }

  get parent(): MCTSNode<State, Action> | undefined {
    return this.parent_
  }

  addChild(
    mctsState: MCTSState<State, Action>,
    possibleActions: Action[],
    action: Action
  ): MCTSNode<State, Action> {
    const node = new MCTSNode(mctsState, possibleActions, this, action)
    this.children_.push(node)
    return node
  }

  isNotFullyExpanded(): boolean {
    return this.possibleActionsLeftToExpand_.length > 0
  }
}

/**
 *
 * @hidden
 * @internal
 * @param State An object representing the state of the game.
 */
export class MCTSState<State, Action> {
  private reward_: number = 0
  private visits_: number = 0
  constructor(private state_: State) {}

  get reward(): number {
    return this.reward_
  }
  set reward(value: number) {
    this.reward_ = value
  }

  get visits(): number {
    return this.visits_
  }
  set visits(value: number) {
    this.visits_ = value
  }

  get state(): State {
    return this.state_
  }
}
