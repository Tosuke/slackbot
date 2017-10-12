export interface Command {
  func: {
    name: string
    param: string
  }
  arg: string
}

export type FilterFunction = (...args) => string

import { slackApiClient } from './slack/slack'
import { format } from 'util'

export async function callCommand(
  command: Command,
  user: string,
  channel: string
): Promise<void> {
  let res: string | undefined = undefined
  try {
    if (command.func.name === 'evaljs') {
      res = evalCommand(command.arg)
    }

    if (res) {
      await slackApiClient('chat.postMessage', {
        channel,
        username: 'tskbot',
        text: res,
      })
    }
  } catch (err) {
    await slackApiClient('chat.postMessage', {
      channel,
      username: 'tskbot',
      text: format(err),
    })
  }
}

import { secureEval } from './vm/secure_eval'

function evalCommand(arg: string): string {
  const tmp = secureEval(arg)
  return tmp.then(a => format(a)).catch(e => e.toString()).value || 'no value'
}
