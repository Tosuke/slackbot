import { config } from 'dotenv'
config()

import { slackEvent } from './slack/slack'
main().catch(e => console.log(e))

async function main() {
  slackEvent.on('message', res => {
    console.log(res)
  })
}
