<h1 align="center">
  <img src="https://github.com/Neoflash1979/macao/raw/master/images/Macao-logo-color.png" alt="Macao Logo" />
</h1>

[![Build Status](https://travis-ci.org/Neoflash1979/macao.svg?branch=master)](https://travis-ci.org/Neoflash1979/macao)
[![Coverage Status](https://coveralls.io/repos/github/Neoflash1979/macao/badge.svg)](https://coveralls.io/github/Neoflash1979/macao)
[![npm version](https://badge.fury.io/js/macao.svg)](https://www.npmjs.com/package/macao)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com/)

## [Usage Overview](#usage-overview)

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
