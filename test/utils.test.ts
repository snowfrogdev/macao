import { getRandomIntInclusive, spliceRandom, loopFor, now } from '../src/utils'
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
      const start = now()
      loopFor(0.1).seconds(() => {
        //
      })
      const time = now() - start
      expect(time).toBeGreaterThan(98)
      expect(time).toBeLessThan(102)
    })
  })
  describe('when called with 100 milliseconds', () => {
    it('should loop for 100 milliseconds', () => {
      const start = now()
      loopFor(100).milliseconds(() => {
        //
      })
      const time = now() - start
      expect(time).toBeGreaterThan(98)
      expect(time).toBeLessThan(102)
    })
  })
  describe('when called with 10 turns', () => {
    it('should loop for 10 turns', () => {
      let turns = 0
      loopFor(10).turns(() => {
        turns++
      })

      expect(turns).toBeCloseTo(10, 0)
    })
  })
})
