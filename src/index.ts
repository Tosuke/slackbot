import { config } from 'dotenv'
config()
import * as slack from './slack'

slack.api('chat.postMessage', {
  channel: '#bot-dev',
  text: 'hogehogepiyopiyo',
})
