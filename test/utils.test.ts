import { getRandomIntInclusive, spliceRandom, loopFor } from '../src/utils'

describe('The getRandomIntInclusive function', () => {
  describe('when given the numbers 15 and 62', () => {
    it('should return a number between 15 and 62, inclusively.', () => {
      expect(getRandomIntInclusive(15, 62)).toBeGreaterThanOrEqual(15)
      expect(getRandomIntInclusive(15, 62)).toBeLessThanOrEqual(62)
    })
  })
})

describe('The spliceRandom function', () => {
  describe('when given an array of numbers', () => {
    it('should remove a random item from it.', () => {
      const array = [0, 1, 2, 3, 4, 5]
      spliceRandom(array)
      expect(array).toHaveLength(5)
    })
    it('should return a number', () => {
      const array = [0, 1, 2, 3, 4, 5]
      expect(spliceRandom(array)).toBeGreaterThanOrEqual(0)
      expect(spliceRandom(array)).toBeLessThanOrEqual(5)
    })
  })
})

describe('The loopFor function', () => {
  describe('when called with 0.1 seconds', () => {
    it('should loop for 0.1 seconds', () => {
      const start = performance.now()
      loopFor(0.1).seconds(() => {
        //
      })
      const time = performance.now() - start
      expect(time).toBeGreaterThan(99)
      expect(time).toBeLessThan(101)
    })
  })
  describe('when called with 100 milliseconds', () => {
    it('should loop for 100 milliseconds', () => {
      const start = performance.now()
      loopFor(100).milliseconds(() => {
        //
      })
      const time = performance.now() - start
      expect(time).toBeGreaterThan(99)
      expect(time).toBeLessThan(101)
    })
  })
  describe('when called with 20 turns', () => {
    it('should loop for 20 turns', () => {
      let turns = 0
      loopFor(10).turns(() => {
        turns++
      })

      expect(turns).toBeCloseTo(10, 0)
    })
  })
})