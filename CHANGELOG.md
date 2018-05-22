<a name="2.0.1"></a>
## [2.0.1](https://github.com/Neoflash1979/macao/compare/v2.0.0...v2.0.1) (2018-05-22)


### Bug Fixes

* Trigger new patch release for major documentation update ([75c61d8](https://github.com/Neoflash1979/macao/commit/75c61d8))

<a name="2.0.0"></a>
# [2.0.0](https://github.com/Neoflash1979/macao/compare/v1.5.0...v2.0.0) (2018-05-17)


### Features

* **macao.ts:** Add asynchronous getAction method ([a2995a0](https://github.com/Neoflash1979/macao/commit/a2995a0))


### Performance Improvements

* **utils.ts:** Modify now() so that it uses performance.now() in Node.js ([324e09a](https://github.com/Neoflash1979/macao/commit/324e09a))


### BREAKING CHANGES

* **macao.ts:** Macao.getAction() is now asynchronous and returns a `Promise` that resolves into
and `Action`.
