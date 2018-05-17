import { DataGateway, MCTSFacade, DefaultMCTSFacade } from '../src/mcts/mcts'
import { TranspositionTable } from '../src/data-store'
import {
  ticTacToeFuncs,
  TicTacToeState,
  TicTacToeMove,
  ticTacToeBoard
} from './tic-tac-toe/tic-tac-toe'
import { MCTSState, MCTSNode } from '../src/entities'
import { Expand, DefaultExpand } from '../src/mcts/expand/expand'
import {
  BestChild,
  UCB1,
  DefaultUCB1,
  DefaultBestChild
} from '../src/mcts/select/best-child/best-child'
import { Select, DefaultSelect } from '../src/mcts/select/select'
import { Simulate, DefaultSimulate } from '../src/mcts/simulate/simulate'
import { BackPropagate, DefaultBackPropagate } from '../src/mcts/back-propagate/back-propagate'
import { loopFor } from '../src/utils'

let dataStore: DataGateway<TicTacToeState, MCTSState<TicTacToeState, TicTacToeMove>>
let expand: Expand<TicTacToeState, TicTacToeMove>
let bestChild: BestChild<TicTacToeState, TicTacToeMove>
let select: Select<TicTacToeState, TicTacToeMove>
let simulate: Simulate<TicTacToeState, TicTacToeMove>
let backPropagate: BackPropagate<TicTacToeState, TicTacToeMove>
let mcts: MCTSFacade<TicTacToeState, TicTacToeMove>
let ucb1: UCB1<TicTacToeState, TicTacToeMove>

beforeEach(() => {
  const map = new Map()
  dataStore = new TranspositionTable(map)
  expand = new DefaultExpand(ticTacToeFuncs.applyAction, ticTacToeFuncs.generateActions, dataStore)
  ucb1 = new DefaultUCB1(1.414)
  bestChild = new DefaultBestChild(ucb1)
  select = new DefaultSelect(ticTacToeFuncs.stateIsTerminal, expand, bestChild, ucb1, Infinity)
  simulate = new DefaultSimulate(
    ticTacToeFuncs.stateIsTerminal,
    ticTacToeFuncs.generateActions,
    ticTacToeFuncs.applyAction,
    ticTacToeFuncs.calculateReward
  )
  backPropagate = new DefaultBackPropagate(1)
  mcts = new DefaultMCTSFacade(
    select,
    expand,
    simulate,
    backPropagate,
    bestChild,
    ticTacToeFuncs.generateActions,
    dataStore,
    100,
    1.414
  )
})

describe('The DefaultSelect instance', () => {
  describe('when the current node is terminal', () => {
    const ticTacToeBoard = [[1, 1, -1], [1, 0, -1], [-1, 0, -1]]
    const state: TicTacToeState = {
      board: ticTacToeBoard,
      player: 1
    }
    const mtcsState = new MCTSState(state)
    const node = new MCTSNode(mtcsState, ticTacToeFuncs.generateActions(state))
    it('should return the current node', () => {
      expect(select.run(node)).toBe(node)
    })
  })
  describe('when the current node is not terminal', () => {
    const ticTacToeBoard = [[1, 1, -1], [1, 0, -1], [-1, -1, 1]]
    const state: TicTacToeState = {
      board: ticTacToeBoard,
      player: 1
    }

    it('should return a node that is not the current node.', () => {
      const mtcsState = new MCTSState(state)
      const node = new MCTSNode(mtcsState, ticTacToeFuncs.generateActions(state))
      const result = select.run(node)
      expect(result).toBeInstanceOf(MCTSNode)
      expect(result).not.toBe(node)
    })
  })
})

describe('The DefaultUCB1 function', () => {
  describe('given a parent with 300 visits and a node with 100 visites and 50 reward ', () => {
    it('should return a number close to 0.8377', () => {
      const ticTacToeBoard = [[1, 1, -1], [1, 0, -1], [-1, 0, -1]]
      const state: TicTacToeState = {
        board: ticTacToeBoard,
        player: 1
      }

      const child = new MCTSState(state)
      child.visits = 100
      child.reward = 50
      expect(ucb1.run(300, child)).toBeCloseTo(0.8377)
    })
  })
})

describe('The DefaultBestChild instance', () => {
  describe('given a node ', () => {
    it('should return the child with the highest UCB1 score', () => {
      const ticTacToeBoard = [[1, 0, -1], [-1, -1, 1], [1, 0, 0]]
      const state: TicTacToeState = {
        board: ticTacToeBoard,
        player: 1
      }
      const parentState = new MCTSState(state)
      const child1State = new MCTSState(state)
      const child2State = new MCTSState(state)
      const child3State = new MCTSState(state)
      const parentNode = new MCTSNode(parentState, ticTacToeFuncs.generateActions(state))
      parentNode.addChild(child1State, ticTacToeFuncs.generateActions(state), {
        col: 1,
        row: 0
      })
      parentNode.addChild(child2State, ticTacToeFuncs.generateActions(state), {
        col: 1,
        row: 0
      })
      parentNode.addChild(child3State, ticTacToeFuncs.generateActions(state), {
        col: 1,
        row: 0
      })
      parentState.visits = 300
      child1State.visits = 100
      child1State.reward = 50
      child2State.visits = 150
      child2State.reward = 100
      child3State.visits = 50
      child3State.reward = 25

      expect(bestChild.run(parentNode)).toBe(parentNode.children[2])
    })
  })
})

describe('The DefaultExpand instance', () => {
  describe('when the current node is not fully expanded', () => {
    const ticTacToeBoard = [[1, 1, -1], [1, 0, -1], [-1, 0, -1]]
    const state: TicTacToeState = {
      board: ticTacToeBoard,
      player: 1
    }
    const mtcsState = new MCTSState(state)
    let node
    beforeEach(() => {
      node = new MCTSNode(mtcsState, ticTacToeFuncs.generateActions(state))
    })

    it('should create a new child node', () => {
      expand.run(node)
      expect(node.children[0]).toBeInstanceOf(MCTSNode)
    })
    it('should return a new child node', () => {
      expect(expand.run(node)).toBe(node.children[0])
    })
  })
})

describe('The DefaultSimulate instance', () => {
  it('returns a number that is either 1, 0 or -1', () => {
    const ticTacToeBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    const state: TicTacToeState = {
      board: ticTacToeBoard,
      player: 1
    }
    expect(simulate.run(state)).toBeGreaterThanOrEqual(-1)
    expect(simulate.run(state)).toBeLessThanOrEqual(1)
  })
})

describe('The DefaultMCTSFacade instance', () => {
  describe('when calling getActionSync', () => {
    it('returns an action', () => {
      const ticTacToeBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
      const state: TicTacToeState = {
        board: ticTacToeBoard,
        player: 1
      }
      expect(mcts.getActionSync(state)).toBeDefined()
    })
  })
  describe('when calling getAction', () => {
    it('returns an action', async () => {
      const ticTacToeBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
      const state: TicTacToeState = {
        board: ticTacToeBoard,
        player: 1
      }
      const data = await mcts.getAction(state)
      expect(data).toBeDefined()
    })
  })
})
