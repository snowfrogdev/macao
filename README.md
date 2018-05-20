<h1 align="center">
  <img src="https://github.com/Neoflash1979/macao/raw/master/images/Macao-logo-color.png" alt="Macao Logo" />
</h1>

[![Build Status](https://travis-ci.org/Neoflash1979/macao.svg?branch=master)](https://travis-ci.org/Neoflash1979/macao)
[![Coverage Status](https://coveralls.io/repos/github/Neoflash1979/macao/badge.svg)](https://coveralls.io/github/Neoflash1979/macao)
[![npm version](https://badge.fury.io/js/macao.svg)](https://www.npmjs.com/package/macao)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com/)

**Macao** is a simple framework that allows the addition of powerful game AI to your JavaScript game with minimal configuration and coding.

## [Why use **Macao**](#why)

Perhaps:

1. You are programming a simple game like Tic-Tac-Toe, Connect Four, Nim or the likes and would like to make the game playable against "the computer" without having to code a bunch of if statements, state machines and decision trees.
2. You're programming a more complicated game like chess, Checkers or Go. Unfortunately, programming an AI player that is able to challenge good human players usually requires imparting the AI with the knowledge of expert players, and you are not. You may know the rules of the game, but you are no Grand Master.
3. You are developing an entirely original game. Obviously, you know the rules of the game since you are the one who invented it, but do you know the best strategies to employ during play? How can you? Unlike with chess, your game hasn't been played by millions of people over centuries so there are no doubt various ways to play your game that even YOU haven't thought about.
4. You are building a prototype of a game and, eventually you plan to give it a very complicated AI with detailed expert domain knowledge, gained through weeks of machine learning and written in thousands of lines of code. But for now, you'd really just like to figure out if and how the game works and if it's fun to play.

## [What Is **Macao**](#what)

**Macao** is a simple framework that allows the addition of powerful game AI to your JavaScript game with minimal configuration and coding. It is based on the powerful, yet simple, [Monte Carlo Tree Search](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) algorithm. **Macao** makes it possible for you to add AI to your game, even if you are a bad player and don't understand the strategy. All you need to know are the rules of the game, that's it, and that's all **Macao** needs to know in order to work it's magic.

## [How to use **Macao**](#how)

```javascript
import { Macao } from "macao";

// Functions that implement the game's rules.
// These functions are provided by you.
const funcs = {
  generateActions,
  applyAction,
  stateIsTerminal,
  calculateReward
};

const config = {
  duration: 30
  // ...
};

const macao = new Macao(funcs, config);

// Somewhere inside your game loop
const action = macao.getAction(state);
```

## [Installation](#installation)

```shell
npm install macao --save
```

## [API](#api)

You can read the API documentation [here](https://neoflash1979.github.io/macao/).

## [Contributing](#contributing)
Please take a look at our [contributing](https://github.com/Neoflash1979/macao/blob/master/CONTRIBUTING.md) guidelines if you're interested in helping!

## [Changelog](#changelog)
See [CHANGELOG.md](https://github.com/Neoflash1979/macao/blob/master/CHANGELOG.md)

## [License](#license)

Macao is provided under the [MIT License](https://github.com/Neoflash1979/macao/blob/master/LICENSE).
