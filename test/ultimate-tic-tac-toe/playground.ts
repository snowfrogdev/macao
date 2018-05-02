import { Macao } from '../../src/macao'
import { uTicTacToeFuncs } from './ultimate-tic-tac-toe'
import { loopFor } from '../../src/utils'
import { DefaultSimulate } from '../../src/mcts'

/**
 * After one million random playouts, its seems that the odds, for the first player,
 * are 50.9% win, 7.2% draw, 41.9% loss.
 */

/*
let draws = 0;
let wins = 0;
let losses = 0;
loopFor(1).turns(() => {
  const uTicTacToeBoard = [
    [
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    ],
    [
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    ],
    [
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    ]
  ];
  let state = {
    board: uTicTacToeBoard,
    player: -1,
    previousAction: { bigRow: -1, bigCol: -1, smallRow: -1, smallCol: -1 }
  };

  const mcts = new Macao(
    {
      stateIsTerminal: uTicTacToeFuncs.stateIsTerminal,
      generateActions: uTicTacToeFuncs.generateActions,
      applyAction: uTicTacToeFuncs.applyAction,
      calculateReward: uTicTacToeFuncs.calculateReward
    },
    { duration: 85 }
  );

  while (!uTicTacToeFuncs.stateIsTerminal(state)) {    
    const action = mcts.getAction(state); 
    state = uTicTacToeFuncs.applyAction(state, action);
  }
  
  const result = uTicTacToeFuncs.calculateReward(state, 1);

  switch (result) {
    case 0:
      draws++;
      break;
    case 1:
      wins++;
      break;
    case -1:
      losses++;
      break;
  }
});

losses;
wins;
draws;
*/
/*
const uTicTacToeBoard = [
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ],
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ],
  [
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
    [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  ]
];
let state = {
  board: uTicTacToeBoard,
  player: -1,
  previousAction: { bigRow: -1, bigCol: -1, smallRow: -1, smallCol: -1 }
};

const simulate = new DefaultSimulate(
  uTicTacToeFuncs.stateIsTerminal,
  uTicTacToeFuncs.generateActions,
  uTicTacToeFuncs.applyAction,
  uTicTacToeFuncs.calculateReward
);

let wins = 0;
let draws = 0;
let losses = 0;
loopFor(1000000).turns(() => {
  const result = simulate.run(state);

  switch (result) {
    case 0:
      draws++;
      break;
    case 1:
      wins++;
      break;
    case -1:
      losses++;
      break;
  }
});
console.log({wins, draws, losses});
*/
