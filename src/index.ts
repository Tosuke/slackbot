import { config } from 'dotenv'
config()

import { slackEvent, initialize, slackUsersList } from './slack/slack'
import parse from './parser'
import { callCommand } from './command'
main().catch(e => console.log(e))

async function main() {
  await initialize()

  console.log(slackUsersList)

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
