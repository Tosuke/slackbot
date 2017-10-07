import { config } from 'dotenv'
if (process.env.NODE_ENV !== 'production') config()

import { slackEvent, initialize } from './slack/slack'
import parse from './parser'
import { callCommand } from './command'
main().catch(e => console.log(e))

async function main() {
  await initialize()

  slackEvent.on('message', async res => {
    if (res.subtype === undefined) {
      const command = parse(unescape(res.text))
      if (command === null) return
      console.log(command)
      await callCommand(command, res.user, res.channel)
    }
  })
}

function unescape(text: string): string {
  return text
    .replace('&amp;', '&')
    .replace('&lt;', '<')
    .replace('&gt;', '>')
}
