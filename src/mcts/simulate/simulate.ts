import {
  Playerwise,
  StateIsTerminal,
  GenerateActions,
  ApplyAction,
  CalculateReward
} from '../../entities'
import { spliceRandom } from '../../utils'

/**
 * The Simulate interface provides a playthrough of the game and is
 * a part of the Monte Carlo Tree Search algorithm.
 * @hidden
 * @internal
 */
export interface Simulate<State, Action> {
  run: (state: State) => number
}

/**
 * The DefaultSimulate class provides, trough it's [[run]] method,
 * a standard playthrough of the game where each move is selected entirely at random.
 * @hidden
 * @internal
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
   * The `run` method of the [[DefaultSimulate]] class runs a standard,
   * entirely random, simulation of the game and returns a number representing
   * the result of the simulation from the perspective of the player who's just
   * played a move and is now waiting for his opponent's turn.
   * @param {State} state An object representing the state of the game.
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
 * The DecisiveMoveSimulate class provides, trough it's [[run]] method,
 * a playthrough of the game where each time there is a winning move to be played,
 * that move is selected, otherwise moves are selected at random.
 * See ["On the Huge Benefit of Decisive Moves in Monte-Carlo Tree
 * Search Algorithms"](https://hal.inria.fr/inria-00495078/document) - Teytaud & Teytaud
 * @hidden
 * @internal
 */
export class DecisiveMoveSimulate<State extends Playerwise, Action>
  implements Simulate<State, Action> {
  /**
   * Creates an instance of DecisiveMoveSimulate
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
   * The `run` method of the [[DecisiveMoveSimulate]] class runs a simulated
   * playthrough of the game and returns a number representing
   * the result of the simulation from the perspective of the player who's just
   * played a move and is now waiting for his opponent's turn.
   *
   * During the simulation, each time there is a winning move to be played,
   * that move is selected, otherwise moves are selected at random.   *
   * @param {State} state An object representing the state of the game.
   * @returns {number}
   * @memberof DefaultSimulate
   */
  run(state: State): number {
    const player = state.player
    while (!this.stateIsTerminal_(state)) {
      // Generate possible actions
      const actions = this.generateActions_(state)

      let action: Action | undefined
      // Check all possible moves until you find a winning move and if you do, that is the action to play
      for (const move of actions) {
        const innerState = this.applyAction_(state, move)
        const result = this.calculateReward_(innerState, innerState.player)
        if (result === 1) {
          action = move
          break
        }
      }

      if (!action) action = spliceRandom(actions)

      // Apply action and create new state
      state = this.applyAction_(state, action)
    }
    return this.calculateReward_(state, player)
  }
}

/**
 * The AntiDecisiveMoveSimulate class provides, trough it's [[run]] method,
 * a playthrough of the game where each time there is a winning move to be played,
 * that move is selected. If there are no winning moves, but a move would prevent
 * the opponent from an immediate win, that move is selected. Otherwise moves
 * are selected at random.
 * See ["On the Huge Benefit of Decisive Moves in Monte-Carlo Tree
 * Search Algorithms"](https://hal.inria.fr/inria-00495078/document) - Teytaud & Teytaud
 * @hidden
 * @internal
 */
export class AntiDecisiveMoveSimulate<State extends Playerwise, Action>
  implements Simulate<State, Action> {
  /**
   * Creates an instance of DecisiveMoveSimulate
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
   * The `run` method of the [[AntiDecisiveMoveSimulate]] class runs a simulated
   * playthrough of the game and returns a number representing
   * the result of the simulation from the perspective of the player who's just
   * played a move and is now waiting for his opponent's turn.
   *
   * During the simulation, each time there is a winning move to be played,
   * that move is selected. If there are no winning moves but a move could prevent
   * the opponent from an immediate win, that move is selected. Otherwise moves
   * are selected at random.
   * @param {State} state An object representing the state of the game.
   * @returns {number}
   * @memberof DefaultSimulate
   */
  run(state: State): number {
    const player = state.player
    while (!this.stateIsTerminal_(state)) {
      // Generate possible actions
      const actions = this.generateActions_(state)

      let action: Action | undefined
      // Check all possible moves until you find a winning move and if you do,
      // that is the action to play.
      for (const move of actions) {
        const innerState = this.applyAction_(state, move)
        const result = this.calculateReward_(innerState, innerState.player)
        if (result === 1) {
          action = move
          break
        }
      }

      if (!action) {
        // Check all possible moves to see if one would prevent the opponent from
        // an immediate win and select that move.
        for (const move of actions) {
          state.player *= -1
          const innerState = this.applyAction_(state, move)
          state.player *= -1
          const result = this.calculateReward_(innerState, innerState.player)
          if (result === 1) {
            action = move
            break
          }
        }
      }

      if (!action) action = spliceRandom(actions)

      // Apply action and create new state
      state = this.applyAction_(state, action)
    }
    return this.calculateReward_(state, player)
  }
}
