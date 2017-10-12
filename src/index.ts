if (process.env.NODE_ENV !== 'production') require('dotenv').config()

import { slackEvent, initialize } from './slack/slack'
import parse from './parser'
import { callCommand } from './command'
main().catch(e => console.log(e))

async function main() {
  await initialize()

  slackEvent.on('message', async res => {
    if (res.subtype === undefined) {
      await slackCallCommand(res)
    }
  })
}

import { MessageCreatedEvent } from './slack/model/events/message'

async function slackCallCommand(mes: MessageCreatedEvent) {
  let command = parse(unescape(mes.text))
  if (command === null) return

  if (command.arg.startsWith('```') && command.arg.endsWith('```')) {
    command.arg = command.arg.slice(3, command.arg.length - 3)
  }

  console.log(command)
  await callCommand(command, mes.user, mes.channel)
}

function unescape(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}
