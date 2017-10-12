import * as vm from 'vm'

export default class UntrustedValue<T> {
  readonly value: T | null
  readonly error: Error | null

  public constructor(value: T | null = null, error: Error | null = null) {
    this.value = value
    this.error = error
  }

  public then<S>(
    onFulfilled: (value: T) => S | UntrustedValue<S>,
    onRejected:
      | ((reason: Error) => S | UntrustedValue<S>)
      | null
      | undefined = null
  ): UntrustedValue<S> {
    if (this.error === null) {
      return runFunction(onFulfilled, this.value)
    } else {
      if (onRejected) {
        return runFunction(onRejected, this.error)
      } else {
        return new UntrustedValue<S>(null, this.error)
      }
    }
  }

  public catch<T>(onRejected: (reason: Error) => T) {
    return this.then<T>(a => a as any, onRejected)
  }
}

const runFunctionScript = new vm.Script('__value__=f(...args)', {
  timeout: 2000,
})

function runFunction<T, S>(
  f: (value: T) => S | UntrustedValue<S>,
  ...args
): UntrustedValue<S> {
  const sandbox: any = {
    __value__: undefined,
    f,
    args,
  }
  try {
    runFunctionScript.runInContext(vm.createContext(sandbox), {
      timeout: 2000,
    })
    if (sandbox.__value__ instanceof UntrustedValue) {
      return sandbox.__value__
    } else {
      return new UntrustedValue<S>(sandbox.__value__, null)
    }
  } catch (e) {
    return new UntrustedValue<S>(null, e)
  }
}
