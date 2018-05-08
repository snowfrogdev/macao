import { HashTable } from '../src/data-store'
import { MCTSState } from '../src/entities'

describe('The Hashtable instance', () => {
  it('stores and retrieves elements', () => {
    const table = new HashTable(100)
    const mctsState = new MCTSState({ board: '01010101' })
    const key = 'magickey123'
    table.set(key, mctsState)
    expect(table.get(key)).toBe(mctsState)
    expect(table.get('someOtherKey')).not.toBeDefined()
  })
})
