import { DataGateway } from './mcts/mcts'
import { MCTSState } from './entities'

/**
 *
 * @hidden
 * @internal
 * @template State
 * @template Action
 */
export interface Collection<State, Action> {
  get(key: string): MCTSState<State, Action> | undefined
  set(key: string, value: MCTSState<State, Action>): this
}

/**
 *
 * @hidden
 * @internal
 * @template State
 * @template Action
 */
export class TranspositionTable<State, Action> implements DataGateway<State, Action> {
  constructor(private data_: Collection<State, Action>) {}

  get(key: State): MCTSState<State, Action> | undefined {
    const stringKey = JSON.stringify(key)
    return this.data_.get(stringKey)
  }

  set(key: State, value: MCTSState<State, Action>): this {
    const stringKey = JSON.stringify(key)
    this.data_.set(stringKey, value)
    return this
  }
}

/**
 *
 * @hidden
 * @internal
 * @template Key
 * @template Value
 */
export class HashTable<State, Action> implements Collection<State, Action> {
  private buckets_: Map<string, MCTSState<State, Action>>[] = []
  constructor(private bucketCount_: number) {
    for (let i = 0; i < this.bucketCount_; i++) {
      this.buckets_.push(new Map())
    }
  }

  hashFunction_(key: string) {
    let hash = 0
    if (key.length === 0) return hash
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash
      hash = hash + key.charCodeAt(i)
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  getBucketIndex_(key: string) {
    return this.hashFunction_(key) % this.bucketCount_
  }

  getBucket_(key: string) {
    return this.buckets_[this.getBucketIndex_(key)]
  }

  set(key: string, value: MCTSState<State, Action>): this {
    this.getBucket_(key).set(key, value)
    return this
  }
  get(lookupKey: string) {
    return this.getBucket_(lookupKey).get(lookupKey)
  }
}
