import { DataGateway } from './mcts/mcts'

/**
 *
 * @hidden
 * @internal
 * @export
 * @class DataStore
 * @implements {DataGateway<Key, Value>}
 * @template Key
 * @template Value
 */
export class DataStore<Key, Value> implements DataGateway<Key, Value> {
  constructor(private data_: Map<Key, Value>) {}

  /**
   *
   *
   * @param {Key} key
   * @returns
   * @memberof DataStore
   */
  get(key: Key) {
    return this.data_.get(key)
  }

  /**
   *
   *
   * @param {Key} key
   * @param {Value} value
   * @returns {this}
   * @memberof DataStore
   */
  set(key: Key, value: Value): this {
    this.data_.set(key, value)
    return this
  }
}
