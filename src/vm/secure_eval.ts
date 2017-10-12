import * as vm from 'vm'
import { tryParseProgram, tryParseExpression } from '../parser'
import UntrustedValue from './untrusted_value'

export function secureEval(
  source: string,
  thisobj: any = {}
): UntrustedValue<any> {
  try {
    if (tryParseExpression(source)) {
      return runExpr(source, thisobj)
    } else if (tryParseProgram(source)) {
      return runProgram(source, thisobj)
    } else {
      return new UntrustedValue<any>(
        null,
        new Error('Unsupported Node Type(Bug?)')
      )
    }
  } catch (parseError) {
    return new UntrustedValue<any>(null, parseError)
  }
}

function runExpr(source: string, thisobj: any = {}): UntrustedValue<any> {
  let sandbox: any = {
    __value__: undefined,
    __thisObj__: { ...thisobj },
  }
  try {
    vm.runInContext(
      `__value__=(function(){return ${source}}).call(__thisObj__)`,
      vm.createContext(sandbox),
      {
        timeout: 2000,
      }
    )
    return new UntrustedValue<any>(sandbox.__value__, null)
  } catch (e) {
    return new UntrustedValue<any>(null, e)
  }
}

function runProgram(source: string, thisobj: any = {}): UntrustedValue<any> {
  let sandbox: any = {
    __value__: undefined,
    __thisObj__: { ...thisobj },
  }
  try {
    vm.runInContext(
      `__value__=(function(){${source}}).call(__thisObj__)`,
      vm.createContext(sandbox),
      {
        timeout: 2000,
      }
    )
    return new UntrustedValue<any>(sandbox.__value__, null)
  } catch (e) {
    return new UntrustedValue<any>(null, e)
  }
}
