import { EventEmitter } from 'events'

export default class TypedEventEmitter<T> extends EventEmitter {
  addListener<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this {
    return super.addListener(event, listener)
  }
  on<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this {
    return super.on(event, listener)
  }
  once<K extends keyof T>(event: K, listener: (arg: T[K]) => any): this {
    return super.once(event, listener)
  }
  removeListener<K extends keyof T>(
    event: K,
    listener: (arg: T[K]) => any
  ): this {
    return super.removeListener(event, listener)
  }
  removeAllListeners<K extends keyof T>(event?: K): this {
    return super.removeAllListeners(event)
  }

  listeners<K extends keyof T>(event: K): ((arg: T[K]) => any)[] {
    return super.listeners(event) as ((arg: T[K]) => any)[]
  }
  emit<K extends keyof T>(event: K, arg: T[K]): boolean {
    return super.emit(event, arg)
  }
  listenerCount<K extends keyof T>(type: K): number {
    return super.listenerCount(type)
  }
  // Added in Node 6...
  prependListener<K extends keyof T>(
    event: K,
    listener: (arg: T[K]) => any
  ): this {
    return super.prependListener(event, listener)
  }
  prependOnceListener<K extends keyof T>(
    event: K,
    listener: (arg: T[K]) => any
  ): this {
    return super.prependOnceListener(event, listener)
  }
  eventNames(): (string | symbol)[] {
    return super.eventNames()
  }
}
