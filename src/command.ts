export interface Command {
  func: {
    name: string
    param: string
  }
  args: Array<string>
  argRaw: string
}

import { slackApiClient } from './slack/slack'

export async function callCommand(
  command: Command,
  user: string,
  channel: string
): Promise<void> {
  if (command.func.name === 'eval') {
    const res = secureEval(command.argRaw)
    if (res.err) {
      await slackApiClient('chat.postMessage', {
        channel: channel,
        text: res.err.toString(),
        usename: 'tskbot',
      })
    } else {
      await slackApiClient('chat.postMessage', {
        channel: channel,
        text: encodeURIComponent(
          (() =>
            typeof res.value === 'string'
              ? res.value
              : JSON.stringify(res.value, null, '\t'))()
        ),
        usename: 'tskbot',
      })
    }
  }
}

import * as vm from 'vm'
function secureEval(expr: string): { value: any; err: Error | null } {
  const sandbox: any = {
    value: undefined,
    err: null,
    src: expr,
  }
  const context = vm.createContext(sandbox)
  try {
    vm.runInContext(`value=(${expr});`, context, {
      timeout: 1000,
    })
  } catch (err) {
    sandbox.err = err
  }
  return sandbox
}
